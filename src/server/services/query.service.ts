import { Server } from 'miragejs'
import eventSegmentationsMocks from '@/mocks/eventSegmentations/eventSegmentations.json'
import funnelsMocks from '@/mocks/reports/funnels.json'

export function queriesRoutes(server: Server) {
  server.post('/projects/:project_id/queries/event-segmentation', (_, request) => {
    const body = JSON.parse(request.requestBody)

    if (body.events?.length || body?.segments?.length) {
      return eventSegmentationsMocks
    } else {
      return {
        columns: [],
      }
    }
  })

  server.post(`/projects/:project_id/queries/funnel`, () => {
    return funnelsMocks
  })
}
