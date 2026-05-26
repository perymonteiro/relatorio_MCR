
import type { ImmutableObject } from 'seamless-immutable'

export interface Config {
  exampleConfigProperty?: string
  anosProdes?: number[] // 2019–2030
}

export type IMConfig = ImmutableObject<Config>
