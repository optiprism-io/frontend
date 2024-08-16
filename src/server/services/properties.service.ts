import type { Server } from 'miragejs'

export function propertiesRoutes(server: Server) {
  server.get('/projects/:project_id/schema/custom-properties', () => {
    return {
      events: server.schema.db.customProperties,
    }
  })
}
