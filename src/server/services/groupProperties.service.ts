import type { Request, Schema } from '@/server/types'
import type { Server } from 'miragejs'

export function groupPropertiesRoutes(server: Server) {
  server.get('/projects/:project_id/schema/group-properties/:group_id', getGroupProperties)
}

function getGroupProperties(schema: Schema, request: Request) {
  return {
    data: schema.db.groupProperties.map(item => ({ ...item, groupId: request.params.group_id })),
  }
}
