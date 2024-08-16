import { faker } from '@/server/faker'

import type { Server } from 'miragejs'

export function dashboardsRoutes(server: Server) {
  server.get('/projects/:project_id/dashboards', schema => {
    return {
      data: schema.db.dashboards,
      meta: {},
    }
  })

  server.post('/projects/:project_id/dashboards', (schema, request) => {
    const body = JSON.parse(request.requestBody)
    return schema.db.dashboards.insert({
      id: faker.string.numeric(4),
      ...body,
    })
  })

  server.put('/projects/:project_id/dashboards/:dashboard_id', (schema, request) => {
    const requestBody = JSON.parse(request.requestBody)
    return schema.db.dashboards.update(request.params.dashboard_id, requestBody)
  })

  server.delete('/projects/:project_id/dashboards/:dashboard_id', (schema, request) => {
    schema.db.dashboards.remove(request.params.dashboard_id)
    return request.params.dashboard_id
  })
}
