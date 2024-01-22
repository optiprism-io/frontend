import MirageSchema from 'miragejs/orm/schema'
import { AnyFactories, AnyModels, Registry } from 'miragejs/-types'
import { Request } from 'miragejs'

type Schema = MirageSchema<Registry<AnyModels, AnyFactories>>

export type {
  Schema,
  Request
}