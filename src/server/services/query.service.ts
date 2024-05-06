import { Server } from 'miragejs'
import eventSegmentationsMocks from '@/mocks/eventSegmentations/eventSegmentations.json'
import conversionStepsMocks from '@/mocks/reports/funnels/conversionSteps'
import conversionOverTimeMocks from '@/mocks/reports/funnels/conversionOverTime'
import {
  FunnelConversionOverTimeChartTypeTypeEnum,
  FunnelQuery,
  FunnelStepsChartTypeTypeEnum,
} from '@/api'
import { CustomError } from '@/server/models/CustomError'

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

  server.post(`/projects/:project_id/queries/funnel`, (_, request) => {
    const body = JSON.parse(request.requestBody) as FunnelQuery
    const graphType = body.chartType.type

    if (graphType === FunnelStepsChartTypeTypeEnum.Steps) {

      return {
        steps: conversionStepsMocks.steps.slice(0, body.steps.length)
      }
    }
    if (graphType === FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime)
      return conversionOverTimeMocks

    return new CustomError().NotImplemented("Don't have mock for this type of graph yet")
  })
}
