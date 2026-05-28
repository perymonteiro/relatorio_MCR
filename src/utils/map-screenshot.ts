import {
  MapViewManager,
  JimuMapViewStatus,
  loadArcGISJSAPIModules,
  type JimuMapView
} from 'jimu-arcgis'
import {
  getAppStore,
  geometryUtils,
  type DataRecord,
  type DataSource
} from 'jimu-core'
import type { IGeometry } from '@esri/arcgis-rest-request'

const VIEW_READY_TIMEOUT_MS = 20000
const SCREENSHOT_WIDTH = 900
const SCREENSHOT_HEIGHT = 675
const MIN_VIEW_WIDTH = 320
const MIN_VIEW_HEIGHT = 240
const SCREENSHOT_RETRY_DELAYS_MS = [0, 600, 1200, 2000, 3500, 5000]
const CAPTURE_PASS_DELAYS_MS = [0, 1500, 3000]
const SCREENSHOT_JPEG_QUALITY = 0.82
const PDF_IMAGE_MAX_WIDTH = 900
/** Margem extra ao enquadrar o imóvel (expand no extent + padding em px no goTo). */
const MAP_FIT_EXTENT_FACTOR = 1.4
const MAP_FIT_PADDING_PX = 72

export type MapImageFormat = 'PNG' | 'JPEG'

/** IDs de widgets Map (arcgis-map) na aplicação. */
export const discoverArcgisMapWidgetIds = (): string[] => {
  try {
    const state = getAppStore().getState() as {
      appConfig?: { widgets?: Record<string, { uri?: string }> }
      appStateInBuilder?: { appConfig?: { widgets?: Record<string, { uri?: string }> } }
    }
    const appConfig = state.appConfig ?? state.appStateInBuilder?.appConfig
    if (!appConfig?.widgets) return []

    return Object.entries(appConfig.widgets)
      .filter(([, widget]) => String(widget?.uri ?? '').includes('arcgis-map'))
      .map(([widgetId]) => widgetId)
  } catch {
    return []
  }
}

/** Coleta ids de data source relacionados à camada da widget. */
export const collectRelatedDataSourceIds = (
  mainDs: DataSource | null,
  useDsDataSourceId?: string
): string[] => {
  const ids = new Set<string>()
  if (useDsDataSourceId) ids.add(useDsDataSourceId)
  if (!mainDs) return [...ids]

  ids.add(mainDs.id)

  try {
    const root = mainDs.getRootDataSource?.()
    if (root?.id) ids.add(root.id)
  } catch {
    // ignore
  }

  try {
    const origins = mainDs.getOriginDataSources?.() ?? []
    origins.forEach((ds) => {
      if (ds?.id) ids.add(ds.id)
    })
  } catch {
    // ignore
  }

  try {
    const parent = (mainDs as { getParentDataSource?: () => DataSource }).getParentDataSource?.()
    if (parent?.id) ids.add(parent.id)
  } catch {
    // ignore
  }

  return [...ids]
}

const mapContainsLayer = (jimuMapView: JimuMapView, layerDataSourceIds: string[]): boolean => {
  if (!layerDataSourceIds.length) return false

  for (const dsId of layerDataSourceIds) {
    try {
      if (jimuMapView.getJimuLayerViewByDataSourceId(dsId)) return true
    } catch {
      // camada não está neste mapa
    }
  }

  const layerViews = jimuMapView.getAllJimuLayerViews?.() ?? []
  return layerViews.some((lv) => layerDataSourceIds.includes(lv.layerDataSourceId))
}

const viewPixelArea = (jimuMapView: JimuMapView): number => {
  const w = jimuMapView.view?.width ?? 0
  const h = jimuMapView.view?.height ?? 0
  return w > 0 && h > 0 ? w * h : 0
}

const isMapViewUsable = (jimuMapView: JimuMapView | null | undefined): jimuMapView is JimuMapView => {
  return !!jimuMapView?.view
}

const ensureViewReady = async (jimuMapView: JimuMapView): Promise<boolean> => {
  const view = jimuMapView.view
  if (!view) return false

  if (jimuMapView.status === JimuMapViewStatus.FAILED) return false

  try {
    await view.when()
    return true
  } catch {
    return isMapViewUsable(jimuMapView)
  }
}

const waitForViewReady = async (jimuMapView: JimuMapView): Promise<boolean> => {
  if (await ensureViewReady(jimuMapView)) return true

  const started = Date.now()
  while (Date.now() - started < VIEW_READY_TIMEOUT_MS) {
    if (jimuMapView.status === JimuMapViewStatus.FAILED) return false
    if (await ensureViewReady(jimuMapView)) return true
    await new Promise<void>((resolve) => window.setTimeout(resolve, 200))
  }

  return ensureViewReady(jimuMapView)
}

const waitForViewStationary = async (view: __esri.MapView | __esri.SceneView): Promise<void> => {
  try {
    await view.when()
  } catch {
    // segue mesmo se when falhar
  }

  if (!view.updating) {
    await waitForLayerViewsReady(view)
    return
  }

  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(() => {
      handle?.remove?.()
      resolve()
    }, VIEW_READY_TIMEOUT_MS)

    const handle = view.watch('updating', (updating: boolean) => {
      if (!updating) {
        window.clearTimeout(timeout)
        handle.remove()
        resolve()
      }
    })
  })

  await waitForLayerViewsReady(view)
}

/** Aguarda camadas visíveis terminarem de desenhar (basemap, imagery, etc.). */
export const waitForLayerViewsReady = async (
  view: __esri.MapView | __esri.SceneView
): Promise<void> => {
  const map = view.map
  if (!map) return

  const layers = map.allLayers?.toArray?.() ?? []
  const waits: Promise<void>[] = []

  for (const layer of layers) {
    if (!layer?.visible) continue
    try {
      const lv = await view.whenLayerView(layer)
      if (!lv) continue
      if (!lv.updating) continue
      waits.push(
        new Promise<void>((resolve) => {
          const timeout = window.setTimeout(() => {
            handle?.remove?.()
            resolve()
          }, VIEW_READY_TIMEOUT_MS)
          const handle = lv.watch('updating', (updating: boolean) => {
            if (!updating) {
              window.clearTimeout(timeout)
              handle.remove()
              resolve()
            }
          })
        })
      )
    } catch {
      // layer view indisponível
    }
  }

  if (waits.length) await Promise.all(waits)
  await new Promise<void>((resolve) => window.setTimeout(resolve, 400))
}

interface ViewSizeRestore {
  restore: () => void
}

/**
 * No Experience publicado o mapa pode estar em painel oculto (largura/altura 0).
 * Ajusta temporariamente o container para permitir renderização do screenshot.
 */
export const ensureViewRenderableForCapture = async (
  view: __esri.MapView | __esri.SceneView
): Promise<ViewSizeRestore | null> => {
  if (view.width >= MIN_VIEW_WIDTH && view.height >= MIN_VIEW_HEIGHT) {
    return null
  }

  const container = view.container as HTMLElement | undefined
  if (!container) return null

  const saved = {
    width: container.style.width,
    height: container.style.height,
    minWidth: container.style.minWidth,
    minHeight: container.style.minHeight,
    display: container.style.display,
    visibility: container.style.visibility
  }

  container.style.width = `${SCREENSHOT_WIDTH}px`
  container.style.height = `${SCREENSHOT_HEIGHT}px`
  container.style.minWidth = `${SCREENSHOT_WIDTH}px`
  container.style.minHeight = `${SCREENSHOT_HEIGHT}px`
  if (saved.display === 'none') container.style.display = 'block'
  if (saved.visibility === 'hidden') container.style.visibility = 'visible'

  try {
    container.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    view.resize()
    await waitForViewStationary(view)
  } catch {
    // segue com dimensões atuais
  }

  return {
    restore: () => {
      container.style.width = saved.width
      container.style.height = saved.height
      container.style.minWidth = saved.minWidth
      container.style.minHeight = saved.minHeight
      container.style.display = saved.display
      container.style.visibility = saved.visibility
      try {
        view.resize()
      } catch {
        // ignore
      }
    }
  }
}

/** Detecta screenshot vazio (mapa não renderizado — comum em painel oculto no Enterprise). */
export const isScreenshotMostlyBlank = async (dataUrl: string): Promise<boolean> => {
  if (!dataUrl || dataUrl.length < 120) return true

  return await new Promise<boolean>((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const sampleW = Math.min(48, img.width)
        const sampleH = Math.min(48, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = sampleW
        canvas.height = sampleH
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(false)
          return
        }
        ctx.drawImage(img, 0, 0, sampleW, sampleH)
        const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data
        let sum = 0
        let sumSq = 0
        let n = 0
        for (let i = 0; i < pixels.length; i += 4) {
          const lum =
            pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114
          sum += lum
          sumSq += lum * lum
          n++
        }
        if (n === 0) {
          resolve(true)
          return
        }
        const mean = sum / n
        const variance = sumSq / n - mean * mean
        resolve(mean > 238 && variance < 90)
      } catch {
        resolve(false)
      }
    }
    img.onerror = () => resolve(true)
    img.src = dataUrl
  })
}

/** Reduz tamanho do PDF convertendo para JPEG com largura máxima. */
export const optimizeMapImageForPdf = async (
  dataUrl: string,
  maxWidth = PDF_IMAGE_MAX_WIDTH
): Promise<{ dataUrl: string; width: number; height: number; format: MapImageFormat }> => {
  return await new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1
        const width = Math.max(1, Math.round(img.width * scale))
        const height = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('canvas'))
          return
        }
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', SCREENSHOT_JPEG_QUALITY),
          width,
          height,
          format: 'JPEG'
        })
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = () => reject(new Error('image load failed'))
    img.src = dataUrl
  })
}

const pickLargestMapView = async (
  candidates: JimuMapView[]
): Promise<JimuMapView | null> => {
  let best: JimuMapView | null = null
  let bestArea = 0

  for (const candidate of candidates) {
    if (!candidate || !(await waitForViewReady(candidate))) continue
    const area = viewPixelArea(candidate)
    if (area > bestArea) {
      bestArea = area
      best = candidate
    }
  }

  return best
}

const resolveFromMapWidgetIds = async (
  mapWidgetIds: string[]
): Promise<JimuMapView | null> => {
  if (!mapWidgetIds.length) return null

  const manager = MapViewManager.getInstance()
  const candidates: JimuMapView[] = []

  for (const mapWidgetId of mapWidgetIds) {
    try {
      const group = manager.getJimuMapViewGroup(mapWidgetId)
      const active = group?.getActiveJimuMapView?.()
      if (active) candidates.push(active)

      const views = group?.getAllJimuMapViews?.() ?? []
      views.forEach((view) => {
        if (view) candidates.push(view)
      })
    } catch {
      // grupo ainda não criado para este widget de mapa
    }

    try {
      const viewIds = manager.getAllJimuMapViewIds?.() ?? []
      for (const viewId of viewIds) {
        const jimuMapView = manager.getJimuMapViewById(viewId)
        if (jimuMapView?.mapWidgetId === mapWidgetId) {
          candidates.push(jimuMapView)
        }
      }
    } catch {
      // ignore
    }
  }

  const picked = await pickLargestMapView(candidates)
  if (picked) return picked

  return null
}

const resolveFromRegisteredViews = async (
  layerDataSourceIds: string[]
): Promise<JimuMapView | null> => {
  const manager = MapViewManager.getInstance()
  const allViews = manager.getAllJimuMapViews?.() ?? []
  const withLayer: JimuMapView[] = []
  const anyReady: JimuMapView[] = []

  if (layerDataSourceIds.length > 0) {
    for (const jimuMapView of allViews) {
      if (!jimuMapView || !mapContainsLayer(jimuMapView, layerDataSourceIds)) continue
      withLayer.push(jimuMapView)
    }
  }

  for (const jimuMapView of allViews) {
    if (jimuMapView) anyReady.push(jimuMapView)
  }

  const pickedWithLayer = await pickLargestMapView(withLayer)
  if (pickedWithLayer) return pickedWithLayer

  const pickedAny = await pickLargestMapView(anyReady)
  if (pickedAny) return pickedAny

  const viewIds = manager.getAllJimuMapViewIds?.() ?? []
  const byId: JimuMapView[] = []
  for (const viewId of viewIds) {
    try {
      const jimuMapView = manager.getJimuMapViewById(viewId)
      if (jimuMapView) byId.push(jimuMapView)
    } catch {
      // ignore
    }
  }

  return pickLargestMapView(byId)
}

/**
 * Resolve o JimuMapView do mapa da experience.
 * Prioridade: instância já vinculada via JimuMapViewComponent → ids configurados → detecção automática.
 */
export const resolveJimuMapViewForReport = async (options: {
  activeMapView?: JimuMapView | null
  useMapWidgetIds?: string[]
  layerDataSourceIds?: string[]
}): Promise<JimuMapView | null> => {
  const { activeMapView, useMapWidgetIds = [], layerDataSourceIds = [] } = options

  if (activeMapView && (await waitForViewReady(activeMapView))) {
    return activeMapView
  }

  const configuredIds = useMapWidgetIds.filter(Boolean)
  const autoIds = discoverArcgisMapWidgetIds()
  const mapWidgetIds = configuredIds.length > 0 ? configuredIds : autoIds

  const fromWidgets = await resolveFromMapWidgetIds(mapWidgetIds)
  if (fromWidgets) return fromWidgets

  return await resolveFromRegisteredViews(layerDataSourceIds)
}

export const waitForActiveMapView = async (
  getView: () => JimuMapView | null,
  timeoutMs = VIEW_READY_TIMEOUT_MS
): Promise<JimuMapView | null> => {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const current = getView()
    if (current && (await waitForViewReady(current))) return current
    await new Promise<void>((resolve) => window.setTimeout(resolve, 150))
  }
  const last = getView()
  return last && (await waitForViewReady(last)) ? last : null
}

export interface MapScreenshotResult {
  dataUrl: string
  width: number
  height: number
  format: MapImageFormat
}

const hasGeometryData = (geometry: IGeometry | undefined | null): boolean => {
  if (!geometry) return false
  const g = geometry as Record<string, unknown>
  if (g.x != null && g.y != null) return true
  if (Array.isArray(g.rings) && g.rings.length > 0) return true
  if (Array.isArray(g.paths) && g.paths.length > 0) return true
  if (Array.isArray(g.points) && g.points.length > 0) return true
  return false
}

/** Garante geometria nos registros (reconsulta com returnGeometry se necessário). */
export const ensureRecordsWithGeometry = async (
  mainDs: DataSource,
  records: DataRecord[]
): Promise<DataRecord[]> => {
  if (!records.length) return records

  const recordHasGeometry = (rec: DataRecord) =>
    hasGeometryData(rec.getGeometry?.())

  if (records.every(recordHasGeometry)) return records

  const qds = mainDs as unknown as {
    query?: (q: unknown) => Promise<{ records?: DataRecord[] }>
    getSchema?: () => { idField?: string }
  }
  if (typeof qds.query !== 'function') return records

  const ids = records.map((rec) => rec.getId?.()).filter((id): id is string => !!id)
  if (!ids.length) return records

  const queryParams: Record<string, unknown> = {
    outFields: ['*'],
    returnGeometry: true
  }

  let usedObjectIds = false
  try {
    queryParams.objectIds = ids
    usedObjectIds = true
  } catch {
    // ignore
  }

  if (!usedObjectIds) {
    const schema = qds.getSchema?.()
    const objectIdField = schema?.idField ?? 'OBJECTID'
    const idsList = ids
      .map((id) => (Number.isFinite(Number(id)) ? id : `'${id}'`))
      .join(',')
    queryParams.where = `${objectIdField} IN (${idsList})`
  }

  try {
    const result = await qds.query(queryParams)
    const withGeom = result?.records ?? []
    if (withGeom.length > 0) return withGeom
  } catch {
    // ignore
  }

  return records
}

/** Ajusta o mapa para exibir toda a extensão do(s) imóvel(is) selecionado(s). */
export const fitMapViewToRecords = async (
  jimuMapView: JimuMapView,
  records: DataRecord[]
): Promise<void> => {
  const view = jimuMapView.view
  if (!view || !records.length) return

  const esriGeometries: __esri.Geometry[] = []

  for (const rec of records) {
    const geomJson = rec.getGeometry?.()
    if (!hasGeometryData(geomJson)) continue
    try {
      const geom = await geometryUtils.convertGeometryJsonToGeometryInstance(
        geomJson,
        true
      )
      if (geom) esriGeometries.push(geom)
    } catch {
      // ignora geometria inválida
    }
  }

  if (!esriGeometries.length) return

  try {
    const projected = await geometryUtils.projectToSpatialReference(
      esriGeometries,
      view.spatialReference
    )

    const [geometryEngine] = await loadArcGISJSAPIModules([
      'esri/geometry/geometryEngine'
    ])

    let target: __esri.Geometry | __esri.Extent =
      projected.length === 1
        ? projected[0]
        : geometryEngine.union(projected)

    if (!target) return

    if (target.type !== 'extent' && 'extent' in target && target.extent) {
      target = target.extent.expand(MAP_FIT_EXTENT_FACTOR)
    } else if (target.type === 'extent') {
      target = (target as __esri.Extent).expand(MAP_FIT_EXTENT_FACTOR)
    }

    await view.goTo(
      {
        target,
        padding: MAP_FIT_PADDING_PX
      },
      { animate: false, duration: 0 }
    )

    await waitForViewStationary(view)
  } catch (err) {
    console.warn('[relatorio_MCR] Falha ao enquadrar imóvel no mapa:', err)
  }
}

const takeRawScreenshot = async (
  view: __esri.MapView | __esri.SceneView,
  width: number,
  height: number
): Promise<string | null> => {
  try {
    const screenshot = await view.takeScreenshot({
      width,
      height,
      format: 'jpg',
      quality: Math.round(SCREENSHOT_JPEG_QUALITY * 100)
    })
    return screenshot?.dataUrl ?? null
  } catch (err) {
    console.warn('[relatorio_MCR] takeScreenshot falhou:', err)
    return null
  }
}

/** Captura a visualização do mapa, enquadrando o imóvel selecionado quando possível. */
export const captureMapScreenshot = async (
  jimuMapView: JimuMapView,
  options?: {
    width?: number
    height?: number
    records?: DataRecord[]
    mainDataSource?: DataSource | null
  }
): Promise<MapScreenshotResult | null> => {
  const view = jimuMapView.view
  if (!view) return null

  const records = options?.records ?? []
  if (records.length > 0) {
    const mainDs = options?.mainDataSource
    const recordsWithGeom = mainDs
      ? await ensureRecordsWithGeometry(mainDs, records)
      : records
    await fitMapViewToRecords(jimuMapView, recordsWithGeom)
  }

  const sizeRestore = await ensureViewRenderableForCapture(view)

  try {
    await waitForViewStationary(view)

    const targetWidth = options?.width ?? SCREENSHOT_WIDTH
    const viewW = view.width > 0 ? view.width : SCREENSHOT_WIDTH
    const viewH = view.height > 0 ? view.height : SCREENSHOT_HEIGHT
    const scale = targetWidth / viewW
    const width = Math.round(viewW * scale)
    const height = Math.round(viewH * scale)

    for (const delay of SCREENSHOT_RETRY_DELAYS_MS) {
      if (delay > 0) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, delay))
        await waitForViewStationary(view)
      }

      const dataUrl = await takeRawScreenshot(view, width, height)
      if (!dataUrl) continue

      if (await isScreenshotMostlyBlank(dataUrl)) {
        console.warn('[relatorio_MCR] Screenshot em branco; nova tentativa…')
        continue
      }

      try {
        const optimized = await optimizeMapImageForPdf(dataUrl, PDF_IMAGE_MAX_WIDTH)
        return {
          dataUrl: optimized.dataUrl,
          width: optimized.width,
          height: optimized.height,
          format: optimized.format
        }
      } catch {
        return {
          dataUrl,
          width,
          height,
          format: 'JPEG'
        }
      }
    }

    return null
  } finally {
    sizeRestore?.restore()
  }
}

const collectCandidateMapViews = async (options: {
  activeMapView?: JimuMapView | null
  getActiveMapView?: () => JimuMapView | null
  useMapWidgetIds: string[]
  layerDataSourceIds: string[]
}): Promise<JimuMapView[]> => {
  const seen = new Set<string>()
  const candidates: JimuMapView[] = []

  const add = (view: JimuMapView | null | undefined) => {
    if (!view?.view) return
    const key = `${view.mapWidgetId ?? ''}:${view.id ?? ''}`
    if (seen.has(key)) return
    seen.add(key)
    candidates.push(view)
  }

  add(options.activeMapView ?? null)
  add(options.getActiveMapView?.() ?? null)

  const configuredIds = options.useMapWidgetIds.filter(Boolean)
  const mapWidgetIds =
    configuredIds.length > 0 ? configuredIds : discoverArcgisMapWidgetIds()

  const manager = MapViewManager.getInstance()
  for (const mapWidgetId of mapWidgetIds) {
    try {
      const group = manager.getJimuMapViewGroup(mapWidgetId)
      add(group?.getActiveJimuMapView?.() ?? null)
      ;(group?.getAllJimuMapViews?.() ?? []).forEach((v) => add(v))
    } catch {
      // ignore
    }
  }

  const allViews = manager.getAllJimuMapViews?.() ?? []
  for (const view of allViews) {
    if (
      options.layerDataSourceIds.length > 0 &&
      !mapContainsLayer(view, options.layerDataSourceIds)
    ) {
      continue
    }
    add(view)
  }

  for (const view of allViews) add(view)

  const ready: JimuMapView[] = []
  for (const view of candidates) {
    if (await waitForViewReady(view)) ready.push(view)
  }

  return ready.sort((a, b) => viewPixelArea(b) - viewPixelArea(a))
}

/**
 * Resolve mapas candidatos e captura imagem para o PDF (várias tentativas).
 */
export const captureMapForPdfReport = async (options: {
  activeMapView?: JimuMapView | null
  getActiveMapView?: () => JimuMapView | null
  useMapWidgetIds: string[]
  layerDataSourceIds: string[]
  records: DataRecord[]
  mainDataSource: DataSource | null
}): Promise<MapScreenshotResult | null> => {
  for (const passDelay of CAPTURE_PASS_DELAYS_MS) {
    if (passDelay > 0) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, passDelay))
    }

    let candidates = await collectCandidateMapViews(options)

    if (!candidates.length) {
      const resolved = await resolveJimuMapViewForReport({
        activeMapView: options.activeMapView ?? options.getActiveMapView?.() ?? null,
        useMapWidgetIds: options.useMapWidgetIds,
        layerDataSourceIds: options.layerDataSourceIds
      })
      if (resolved) candidates = [resolved]
    }

    for (const jimuMapView of candidates) {
      const shot = await captureMapScreenshot(jimuMapView, {
        records: options.records,
        mainDataSource: options.mainDataSource
      })
      if (shot) return shot
    }
  }

  return null
}
