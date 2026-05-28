
/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {
  React, jsx, css, Immutable,
  type ImmutableArray, type UseDataSource,
  AllDataSourceTypes
} from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { TextInput } from 'jimu-ui'
import { type IMConfig } from '../config'

interface Props {
  id: string
  useDataSources?: ImmutableArray<UseDataSource>
  onSettingChange?: (setting: unknown) => void
  config?: IMConfig
}

const styles = css`
  & * {
    writing-mode: horizontal-tb !important;
    white-space: normal !important;
    word-break: normal !important;
  }
  .jimu-ui_setting-row__label { min-width: 160px; }
`

const anosValidos = (anos: number[]) => {
  const min = 2019
  const max = 2030
  return Array.from(new Set(anos))
    .filter((a) => Number.isFinite(a))
    .filter((a) => a >= min && a <= max)
    .sort((a, b) => a - b)
}

const parseCsvAnos = (value: string) => {
  const nums = value
    .split(/[,\s;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
  return anosValidos(nums)
}

const Setting = (props: Props) => {
  const { id, useDataSources, onSettingChange, config } = props
  const anos = config?.anosProdes ?? []

  const handleDataSourceChange = (newUseDataSources: UseDataSource[]) => {
    onSettingChange?.({ id, useDataSources: Immutable(newUseDataSources) })
  }

  const handleAnosChange = (value: string) => {
    const novosAnos = parseCsvAnos(value)
    onSettingChange?.({ id, config: { ...config, anosProdes: novosAnos } })
  }

  return (
    <div className="widget-setting-relatorio-mcr" css={styles}>
      <SettingSection title="Dados">
        <SettingRow label="Selecionar camada (Feature Layer)">
          <DataSourceSelector
            isMultiple={false}
            mustUseDataSource
            types={Immutable([AllDataSourceTypes.FeatureLayer])}
            useDataSources={useDataSources}
            onChange={handleDataSourceChange}
            widgetId={id}
          />
        </SettingRow>

        <SettingRow label="Anos PRODES (CSV)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            <TextInput
              size="sm"
              placeholder="Ex.: 2023, 2024"
              defaultValue={anos.join(', ')}
              onAcceptValue={handleAnosChange}
            />
            <div style={{ fontSize: 12, color: '#6b6b6b' }}>
              Informe anos entre 2019 e 2030 separados por vírgula. Ex.: <code>2023, 2024</code>
            </div>
          </div>
        </SettingRow>
      </SettingSection>
    </div>
  )
}

export default Setting
