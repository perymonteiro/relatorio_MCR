
/** @jsx jsx */
import {
  React, jsx,
  type AllWidgetProps,
  type DataSource, type DataRecord,
  DataSourceStatus,
  DataSourceComponent
} from 'jimu-core'
import { IMConfig } from '../config'
import jsPDF from 'jspdf'
import brasao from '../assets/brasaobrasil.png'
import { Button, Loading } from 'jimu-ui'

/** Campos exibidos no PDF após "Resultado:" (rótulo → nomes possíveis na camada). */
const PDF_FIELDS_AFTER_RESULTADO: Array<{
  label: string
  fieldNames: string[]
  formatAsNumber?: boolean
  labelBold?: boolean
}> = [
  { label: 'Soma do desmatamento:', fieldNames: ['soma_desmat'], formatAsNumber: true },
  {
    label: 'Critério aplicado na análise:',
    fieldNames: ['critério_aplicado', 'criterio_aplicado']
  },
  {
    label: 'Imóvel está dentro do limite estabelecido pelo critério:',
    fieldNames: ['dentro_critério', 'dentro_criterio']
  },
  {
    label: 'UUID Prodes identificado(s):',
    fieldNames: ['uuid_prodes'],
    labelBold: true
  }
]

const FIELD_LINE_SPACING = 6

type PdfContext = {
  pdf: InstanceType<typeof jsPDF>
  margin: number
  pageH: number
  maxWidth: number
}

/** Linha "rótulo: valor" com espaçamento igual aos demais campos do imóvel. */
const writeImovelStyleLine = (
  ctx: PdfContext,
  label: string,
  value: string,
  startY: number,
  labelBold = false
): number => {
  const { pdf, margin, pageH, maxWidth } = ctx
  const valueText = value.startsWith(' ') ? value : ` ${value}`
  let y = startY

  if (y > pageH - ctx.margin - 8) {
    pdf.addPage()
    y = ctx.margin
  }

  if (!labelBold) {
    const fullLine = `${label}${valueText}`
    const lines = pdf.splitTextToSize(fullLine, maxWidth) as string[]
    pdf.setFont('helvetica', 'normal')
    lines.forEach((line, index) => {
      if (y > pageH - ctx.margin - 8) {
        pdf.addPage()
        y = ctx.margin
      }
      pdf.text(line, margin, y)
      if (index < lines.length - 1) {
        y += FIELD_LINE_SPACING
      }
    })
    return y + FIELD_LINE_SPACING
  }

  pdf.setFont('helvetica', 'bold')
  const labelWidth = pdf.getTextWidth(label)
  pdf.setFont('helvetica', 'normal')
  const valueLines = pdf.splitTextToSize(valueText.trim(), maxWidth - labelWidth) as string[]

  pdf.setFont('helvetica', 'bold')
  pdf.text(label, margin, y)
  pdf.setFont('helvetica', 'normal')

  if (valueLines.length <= 1) {
    pdf.text(valueLines[0] ?? '', margin + labelWidth, y)
    return y + FIELD_LINE_SPACING
  }

  pdf.text(valueLines[0] ?? '', margin + labelWidth, y)
  for (let i = 1; i < valueLines.length; i++) {
    y += FIELD_LINE_SPACING
    if (y > pageH - ctx.margin - 8) {
      pdf.addPage()
      y = ctx.margin
    }
    pdf.text(valueLines[i], margin, y)
  }
  return y + FIELD_LINE_SPACING
}

const formatPdfFieldValue = (
  value: unknown,
  formatAsNumber?: boolean
): string => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) {
    return '(sem informação)'
  }
  if (formatAsNumber && typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  return String(value)
}

const readRecordField = (
  rec: DataRecord,
  fieldNames: string[]
): unknown => {
  for (const name of fieldNames) {
    const v = rec.getFieldValue?.(name as never)
    if (v !== undefined) return v
  }
  const attrs = rec.getData()?.attributes ?? {}
  for (const name of fieldNames) {
    if (name in attrs) return attrs[name]
    const key = Object.keys(attrs).find(
      (k) => k.toLowerCase() === name.toLowerCase()
    )
    if (key != null) return attrs[key]
  }
  return undefined
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dsRef, setDsRef] = React.useState<DataSource | null>(null)
  const [dsStatus, setDsStatus] = React.useState<DataSourceStatus | undefined>(undefined)

  const useDs = props.useDataSources?.[0]
  const anosProdes = props.config?.anosProdes ?? []

  const getMainDataSource = React.useCallback((ds: DataSource | null): DataSource | null => {
    if (!ds) return null
    const main = (ds as { getMainDataSource?: () => DataSource }).getMainDataSource?.()
    return main ?? ds
  }, [])

  const asQueriable = (ds: DataSource | null) => {
    const q = ds as unknown as { query?: (q: unknown) => Promise<{ records?: DataRecord[] }> }
    return q && typeof q.query === 'function' ? q : null
  }

  const ensureSelectedRecordsWithAllAttributes = React.useCallback(async (): Promise<DataRecord[]> => {
    const main = getMainDataSource(dsRef)
    if (!main) return []

    let recs = main.getSelectedRecords?.() ?? []
    const hasAttrs = (r: DataRecord) => {
      const a = r.getData()?.attributes
      return a && Object.keys(a).length > 0
    }
    if (recs.length > 0 && recs.every(hasAttrs)) return recs

    const ids = main.getSelectedRecordIds?.() ?? []
    if (!ids.length) return recs

    const qds = asQueriable(main)
    if (!qds) return recs

    const queryParams: Record<string, unknown> = { outFields: ['*'], returnGeometry: false }
    let usedObjectIds = false
    try {
      queryParams.objectIds = ids
      usedObjectIds = true
    } catch {
      // ignore
    }

    if (!usedObjectIds) {
      const schema = main.getSchema()
      const objectIdField = schema?.idField ?? 'OBJECTID'
      const idsList = ids
        .map((id) => (typeof id === 'number' ? id : `'${id}'`))
        .join(',')
      queryParams.where = `${objectIdField} IN (${idsList})`
    }

    try {
      const result = await qds.query(queryParams)
      const records = result?.records ?? []
      if (records.length > 0) return records
    } catch {
      // ignore
    }
    return recs
  }, [dsRef, getMainDataSource])

  const buildRowsFromRecords = React.useCallback((records: DataRecord[]) => {
    const camposPreferidos = ['area_ha', 'bioma', 'ano_prodes', 'area_desmatada_ha']
    const rows: Array<[string, string]> = []
    const fmt = (v: unknown) =>
      typeof v === 'number'
        ? v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(v ?? '—')

    const OCULTAR_CAMPOS_INEXISTENTES = false

    records.slice(0, 20).forEach((rec, idx) => {
      const get = (name: string) => rec.getFieldValue?.(name as never)

      camposPreferidos.forEach((campo) => {
        const val = get(campo)
        if (val !== undefined) rows.push([campo, fmt(val)])
      })

      if (anosProdes.length > 0) {
        anosProdes.forEach((ano) => {
          const field = `sobrep_prodes_${ano}`
          const val = get(field)
          if (val !== undefined) {
            rows.push([String(ano), fmt(val)])
          } else if (!OCULTAR_CAMPOS_INEXISTENTES) {
            rows.push([String(ano), '(campo inexistente na camada)'])
          }
        })
      }

      if (idx < Math.min(records.length, 20) - 1) rows.push(['', ''])
    })
    return rows
  }, [anosProdes])

  const gerarPDF = React.useCallback(async () => {
    setError(null)

    if (!useDs) return setError('Nenhuma camada configurada.')
    if (
      !dsRef &&
      dsStatus !== DataSourceStatus.Loaded &&
      dsStatus !== DataSourceStatus.NotReady &&
      dsStatus !== DataSourceStatus.Unloaded
    ) {
      return setError('Aguarde o carregamento da camada.')
    }

    setIsGenerating(true)
    try {
      const recs = await ensureSelectedRecordsWithAllAttributes()
      if (!recs.length) {
        setError('Selecione um imóvel no mapa antes de gerar o relatório.')
        return
      }

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 12
      const lineHeight = 5

      const writeWrapped = (text: string, x: number, y: number, maxWidth: number) => {
        const wrapped = pdf.splitTextToSize(text ?? '', maxWidth) as string[]
        let cy = y
        wrapped.forEach((line) => {
          if (cy > pageH - margin - 8) {
            pdf.addPage()
            cy = margin
          }
          pdf.text(line, x, cy)
          cy += lineHeight
        })
        return cy
      }

      pdf.addImage(brasao, 'PNG', (pageW - 19.8) / 2, margin, 19.8, 20)
      pdf.setFont('helvetica').setFontSize(9)
      const headerLines = [
        'MINISTÉRIO DO MEIO AMBIENTE E MUDANÇA DO CLIMA',
        'SECRETARIA EXTRAORDINÁRIA DE CONTROLE DO DESMATAMENTO E ORDENAMENTO AMBIENTAL TERRITORIAL',
        'DEPARTAMENTO DE POLÍTICAS DE CONTROLE DO DESMATAMENTO E INCÊNDIOS',
        'COORDENAÇÃO-GERAL DE CONTROLE DO DESMATAMENTO'
      ]
      let y = margin + 25
      headerLines.forEach((line) => {
        pdf.text(line, pageW / 2, y, { align: 'center' })
        y += 5
      })
      pdf.line(margin, y + 2, pageW - margin, y + 2)
      let cursorY = y + 10

      pdf.setFontSize(10).text('Relatório MCR', margin, cursorY)
      cursorY += 7

      pdf.setFont('helvetica', 'normal').setFontSize(9)
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, cursorY)
      cursorY += 8

      if (anosProdes.length > 0) {
        pdf.setFont('helvetica', 'italic')
        pdf.text(`Anos PRODES selecionados: ${anosProdes.join(', ')}`, margin, cursorY)
        cursorY += 6
        pdf.setFont('helvetica', 'normal')
      }

      const first = recs[0]
      const get = (name: string) => first.getFieldValue?.(name as never)

      const codImovelTitulo = String(get('cod_imovel') ?? '(sem cod_imovel)')
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Imóvel selecionado: ${codImovelTitulo}`, margin, cursorY)
      cursorY += 6

      const tipoImovel = String(get('tipo_imove') ?? '(sem tipo)')
      const condicaoCadastro = String(get('condicao') ?? '(sem condição)')
      const situacaoCadastro = String(get('status_imo') ?? '(sem situação)')

      pdf.setFont('helvetica', 'normal')
      pdf.text(`Tipo do imóvel: ${tipoImovel}`, margin, cursorY)
      cursorY += 6
      pdf.text(`Condição do cadastro: ${condicaoCadastro}`, margin, cursorY)
      cursorY += 6
      pdf.text(`Situação do cadastro: ${situacaoCadastro}`, margin, cursorY)
      cursorY += 6

      const municipio = String(get('municipio') ?? '(sem município)')
      const uf = String(get('uf') ?? '(sem UF)')
      pdf.text(`Município/UF: ${municipio}/${uf}`, margin, cursorY)
      cursorY += 6

      const contentMaxWidth = pageW - margin - margin
      const pdfCtx: PdfContext = {
        pdf,
        margin,
        pageH,
        maxWidth: contentMaxWidth
      }

      const resultado = get('resultados')
      const resultadoTxt =
        resultado != null && resultado !== '' ? String(resultado) : '(sem resultado)'
      cursorY = writeImovelStyleLine(
        pdfCtx,
        'Resultado:',
        resultadoTxt,
        cursorY,
        false
      )

      PDF_FIELDS_AFTER_RESULTADO.forEach(({ label, fieldNames, formatAsNumber, labelBold }) => {
        const raw = readRecordField(first, fieldNames)
        const valueTxt = formatPdfFieldValue(raw, formatAsNumber)
        cursorY = writeImovelStyleLine(
          pdfCtx,
          label,
          valueTxt,
          cursorY,
          labelBold === true
        )
      })

      pdf.text('Ano', margin, cursorY)
      pdf.text('Área desmatada (ha)', margin + 70, cursorY)
      cursorY += 5
      pdf.line(margin, cursorY, pageW - margin, cursorY)
      cursorY += 4

      const rows = buildRowsFromRecords(recs)
      rows.forEach(([campo, valor]) => {
        if (cursorY > pageH - margin - 10) {
          pdf.addPage()
          cursorY = margin
        }
        const wrapped = pdf.splitTextToSize(valor ?? '', pageW - (margin + 70) - margin)
        pdf.text(campo ?? '', margin, cursorY)
        pdf.text(wrapped as string | string[], margin + 70, cursorY)
        cursorY += 5 * (Array.isArray(wrapped) ? wrapped.length : 1)
      })

      const totalPages = (pdf as { getNumberOfPages: () => number }).getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i).setFontSize(9).setTextColor(120)
        pdf.text(`Página ${i} de ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' })
      }

      pdf.save(
        `relatorio_MCR_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.pdf`
      )
    } catch {
      setError('Falha ao gerar o PDF. Veja o console para detalhes.')
    } finally {
      setIsGenerating(false)
    }
  }, [
    useDs,
    dsRef,
    dsStatus,
    ensureSelectedRecordsWithAllAttributes,
    buildRowsFromRecords,
    anosProdes
  ])

  const isReady =
    !!dsRef &&
    (dsStatus === DataSourceStatus.Loaded ||
      dsStatus === DataSourceStatus.NotReady ||
      dsStatus === DataSourceStatus.Unloaded)

  return (
    <div className="jimu-widget m-2">
      {useDs ? (
        <DataSourceComponent
          useDataSource={useDs}
          widgetId={props.id}
          onDataSourceCreated={(ds) => setDsRef(ds)}
          onDataSourceInfoChange={(info) => setDsStatus(info?.status)}
        />
      ) : (
        <div style={{ color: '#a00', marginBottom: 8 }}>
          Selecione uma camada nas configurações desta widget.
        </div>
      )}

      <Button type="primary" onClick={gerarPDF} disabled={isGenerating || !isReady}>
        {isGenerating ? <Loading /> : 'Gerar PDF'}
      </Button>

      {error && (
        <div
          style={{
            marginTop: 8,
            color: '#b00020',
            background: '#fde7e9',
            padding: 8,
            borderRadius: 4
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

export default Widget
