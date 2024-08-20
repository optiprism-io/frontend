import { faker } from '@/server/faker'

import type { Server } from 'miragejs'

export function reportsRoutes(server: Server) {
  server.get('/projects/:project_id/reports', schema => {
    return {
      data: schema.db.reports.map(item => ({
        ...item,
        id: Number(item.id),
      })),
      meta: {},
    }
  })

  server.post('/projects/:project_id/reports', (schema, request) => {
    const body = JSON.parse(request.requestBody)

    return schema.db.reports.insert({
      id: faker.string.numeric(4),
      ...body,
    })
  })

  server.get('/projects/:project_id/reports/:report_id', (schema, request) => {
    return schema.db.reports.find(request.params.report_id)
  })

  server.put('/projects/:project_id/reports/:report_id', (schema, request) => {
    const body = JSON.parse(request.requestBody)
    return schema.db.reports.update(request.params.report_id, body)
  })

  server.delete('/projects/:project_id/reports/:report_id', (schema, request) => {
    schema.db.reports.remove(request.params.report_id)
    return request.params.report_id
  })
}
