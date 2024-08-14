import { EMPTY_SUCCESS_RES } from '@/server/constants'

import type { Server } from 'miragejs'

export function customEventsRoutes(server: Server) {
  server.get('/projects/:project_id/schema/custom-events', schema => {
    return {
      data: schema.db.customEvents.map(item => ({ ...item, id: Number(item.id) })),
    }
  })

  server.delete('/projects/:project_id/schema/custom-events/:event_id', () => {
    return EMPTY_SUCCESS_RES
  })

  server.post('/projects/:project_id/schema/custom-events', (schema, request) => {
    const customEvents = JSON.parse(request.requestBody)

    return schema.db.customEvents.insert(customEvents)
  })

  server.put('/projects/:project_id/schema/custom-events/:event_id', (schema, request) => {
    const customEvent = JSON.parse(request.requestBody)
    schema.db.customEvents.update(request.params.event_id, customEvent)

    return schema.db.customEvents
  })
}
