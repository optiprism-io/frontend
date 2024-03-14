import { Request, Server } from 'miragejs'
import { Schema } from '@/server/types'

export function organizationsRoutes(server: Server) {
  server.get('/organizations', getOrganizations)
  server.get('/organizations/:org_id', getOrganization)
}

function getOrganizations(schema: Schema) {
  return { data: schema.db.organizations }
}

function getOrganization(schema: Schema, request: Request) {
  return schema.db.organizations.find(request.params.org_id)
}
