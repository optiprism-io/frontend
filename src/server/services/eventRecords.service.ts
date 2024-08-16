import type { Server } from 'miragejs'

export function eventRecordsRoutes(server: Server) {
  server.post('/projects/:project_id/event-records/search', schema => {
    return {
      columns: schema.db.liveStream,
    }
  })

  server.get('/projects/:project_id/event-records/:id', schema => {
    return {
      properties: schema.db.eventRecord,
    }
  })
}
