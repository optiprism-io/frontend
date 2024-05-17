import { Server } from 'miragejs'
import { Schema, Request } from '@/server/types'

export function groupsRoutes(server: Server) {
  server.get('/projects/:project_id/groups', getGroups)
  server.get('/projects/:project_id/schema/group-properties/:group_id', getGroupProperties)
}

function getGroups(schema: Schema) {
  return { data: schema.db.groups }
}

function getGroupProperties(schema: Schema, request: Request) {
  return {
    data: schema.db.groupProperties.map(item => ({ ...item, groupId: request.params.group_id })),
  }
}