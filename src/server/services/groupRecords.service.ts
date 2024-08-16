import type { Server } from 'miragejs'

export function groupRecordsRoutes(server: Server) {
  server.post('/projects/:project_id/group-records/search', schema => {
    return {
      data: schema.db.groupRecords,
    }
  })

  server.put('/projects/:project_id/group-records/:id', (schema, request) => {
    return schema.db.groupRecords.update(request.params.id, JSON.parse(request.requestBody))
  })
}
