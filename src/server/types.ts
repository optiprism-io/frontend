import type { Request } from 'miragejs'
import type { AnyFactories, AnyModels, Registry } from 'miragejs/-types'
import type MirageSchema from 'miragejs/orm/schema'

type Schema = MirageSchema<Registry<AnyModels, AnyFactories>>

export type {
  Schema,
  Request
}