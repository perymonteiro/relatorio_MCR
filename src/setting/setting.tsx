
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
  &.widget-setting-relatorio-mcr {
    width: 100%;
    min-width: 0;
    overflow: visible;
    box-sizing: border-box;
  }
  & * {
    writing-mode: horizontal-tb !important;
    white-space: normal !important;
    word-break: normal !important;
    box-sizing: border-box;
  }
  .jimu-ui_setting-row {
    overflow: visible;
    flex-wrap: wrap;
  }
  .jimu-ui_setting-row__label {
    min-width: 0;
    max-width: 100%;
    flex: 1 1 100%;
  }
  .jimu-ui_setting-row__content {
    flex: 1 1 100%;
    min-width: 0;
    max-width: 100%;
    overflow: visible;
  }
  .setting-field-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    min-width: 0;
  }
  .setting-hint {
    font-size: 12px;
    color: #6b6b6b;
    line-height: 1.4;
    word-wrap: break-word;
  }
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
    <div className="widget-setting-relatorio-mcr jimu-widget-setting w-100" css={styles}>
      <SettingSection title="Dados">
        <SettingRow
          label="Camada (Feature Layer)"
          flow="wrap"
          level={1}
        >
          <DataSourceSelector
            isMultiple={false}
            mustUseDataSource
            types={Immutable([AllDataSourceTypes.FeatureLayer])}
            useDataSources={useDataSources}
            onChange={handleDataSourceChange}
            widgetId={id}
          />
        </SettingRow>

        <SettingRow label="Anos PRODES (CSV)" flow="wrap" level={1}>
          <div className="setting-field-stack">
            <TextInput
              size="sm"
              placeholder="Ex.: 2023, 2024"
              defaultValue={anos.join(', ')}
              onAcceptValue={handleAnosChange}
            />
            <div className="setting-hint">
              Informe anos entre 2019 e 2030 separados por vírgula. Ex.:{' '}
              <code>2023, 2024</code>
            </div>
          </div>
        </SettingRow>
      </SettingSection>
    </div>
  )
}

export default Setting
