import {
  FunnelConversionOverTimeChartTypeTypeEnum,
  FunnelStepsChartTypeTypeEnum,
} from '@/api'
import eventSegmentationsMocks from '@/mocks/eventSegmentations/eventSegmentations.json'
import conversionOverTimeMocks from '@/mocks/reports/funnels/conversionOverTime'
import conversionStepsMocks from '@/mocks/reports/funnels/conversionSteps'
import { CustomError } from '@/server/models/CustomError'

import type {
  FunnelQuery} from '@/api';
import type { Server } from 'miragejs'

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
        groups: conversionStepsMocks.groups,
        steps: conversionStepsMocks.steps.slice(0, body.steps.length)
      }
    }
    if (graphType === FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime)
      return conversionOverTimeMocks

    return new CustomError().NotImplemented("Don't have mock for this type of graph yet")
  })
}
