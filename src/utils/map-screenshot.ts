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

const VIEW_READY_TIMEOUT_MS = 10000
const SCREENSHOT_WIDTH = 900
const SCREENSHOT_HEIGHT = 675
/** Margem extra ao enquadrar o imóvel (expand no extent + padding em px no goTo). */
const MAP_FIT_EXTENT_FACTOR = 1.4
const MAP_FIT_PADDING_PX = 72

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

  if (!view.updating) return

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
}

const resolveFromMapWidgetIds = async (
  mapWidgetIds: string[]
): Promise<JimuMapView | null> => {
  if (!mapWidgetIds.length) return null

  const manager = MapViewManager.getInstance()

  for (const mapWidgetId of mapWidgetIds) {
    try {
      const group = manager.getJimuMapViewGroup(mapWidgetId)
      const active = group?.getActiveJimuMapView?.()
      if (active && await waitForViewReady(active)) return active

      const views = group?.getAllJimuMapViews?.() ?? []
      for (const view of views) {
        if (view && await waitForViewReady(view)) return view
      }
    } catch {
      // grupo ainda não criado para este widget de mapa
    }

    try {
      const viewIds = manager.getAllJimuMapViewIds?.() ?? []
      for (const viewId of viewIds) {
        const jimuMapView = manager.getJimuMapViewById(viewId)
        if (jimuMapView?.mapWidgetId === mapWidgetId && await waitForViewReady(jimuMapView)) {
          return jimuMapView
        }
      }
    } catch {
      // ignore
    }
  }

  return null
}

const resolveFromRegisteredViews = async (
  layerDataSourceIds: string[]
): Promise<JimuMapView | null> => {
  const manager = MapViewManager.getInstance()
  const allViews = manager.getAllJimuMapViews?.() ?? []

  if (layerDataSourceIds.length > 0) {
    for (const jimuMapView of allViews) {
      if (!jimuMapView || !mapContainsLayer(jimuMapView, layerDataSourceIds)) continue
      if (await waitForViewReady(jimuMapView)) return jimuMapView
    }
  }

  for (const jimuMapView of allViews) {
    if (jimuMapView && await waitForViewReady(jimuMapView)) return jimuMapView
  }

  const viewIds = manager.getAllJimuMapViewIds?.() ?? []
  for (const viewId of viewIds) {
    try {
      const jimuMapView = manager.getJimuMapViewById(viewId)
      if (jimuMapView && await waitForViewReady(jimuMapView)) return jimuMapView
    } catch {
      // ignore
    }
  }

  return null
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

  if (activeMapView && await waitForViewReady(activeMapView)) {
    return activeMapView
  }

  const configuredIds = useMapWidgetIds.filter(Boolean)
  const autoIds = discoverArcgisMapWidgetIds()
  const mapWidgetIds = configuredIds.length > 0
    ? configuredIds
    : autoIds

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
    if (current && await waitForViewReady(current)) return current
    await new Promise<void>((resolve) => window.setTimeout(resolve, 150))
  }
  const last = getView()
  return last && (await waitForViewReady(last)) ? last : null
}

export interface MapScreenshotResult {
  dataUrl: string
  width: number
  height: number
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

  await waitForViewStationary(view)

  const viewW = view.width > 0 ? view.width : SCREENSHOT_WIDTH
  const viewH = view.height > 0 ? view.height : SCREENSHOT_HEIGHT
  const scale = (options?.width ?? SCREENSHOT_WIDTH) / viewW
  const width = Math.round(viewW * scale)
  const height = Math.round(viewH * scale)
  const screenshot = await view.takeScreenshot({ width, height })
  const dataUrl = screenshot?.dataUrl
  if (!dataUrl) return null

  return {
    dataUrl,
    width: screenshot?.data?.width ?? width,
    height: screenshot?.data?.height ?? height
  }
}
