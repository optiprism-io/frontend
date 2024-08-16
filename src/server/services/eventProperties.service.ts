import type { Server } from 'miragejs'

export function eventPropertiesRoutes(server: Server) {
  server.get('/projects/:project_id/schema/event-properties', schema => {
    return {
      data: schema.db.eventProperties,
    }
  })

  server.put('/projects/:project_id/schema/event-properties/:property_id', (schema, request) => {
    const property = JSON.parse(request.requestBody)
    return schema.db.eventProperties.update(request.params.property_id, property)
  })
}
