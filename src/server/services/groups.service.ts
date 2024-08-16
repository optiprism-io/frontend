import type { Schema } from '@/server/types'
import type { Server } from 'miragejs'

export function groupsRoutes(server: Server) {
  server.get('/projects/:project_id/groups', getGroups)
}

function getGroups(schema: Schema) {
  return { data: schema.db.groups }
}
