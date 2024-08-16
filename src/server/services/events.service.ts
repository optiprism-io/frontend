import type { Server } from 'miragejs'

export function eventsRoutes(server: Server) {
  server.get('/projects/:project_id/schema/events', schema => {
    return { data: schema.db.events }
  })

  server.put('/projects/:project_id/schema/events/:event_id', (schema, request) => {
    const customEvent = JSON.parse(request.requestBody)

    return schema.db.events.update(request.params.event_id, customEvent)
  })
}
