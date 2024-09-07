import type { UiDropdownItem } from '@/components/uikit/UiDropdown.vue'

import { FunnelConversionOverTimeChartTypeTypeEnum, FunnelStepsChartTypeTypeEnum } from '@/api'
import { uncamelize } from '@/utils/uncamelize'

export type FunnelChartType =
  | FunnelStepsChartTypeTypeEnum
  | FunnelConversionOverTimeChartTypeTypeEnum

export const FUNNEL_VIEWS: UiDropdownItem<FunnelChartType>[] = [
  {
    key: FunnelStepsChartTypeTypeEnum.Steps,
    value: FunnelStepsChartTypeTypeEnum.Steps,
    nameDisplay: uncamelize(FunnelStepsChartTypeTypeEnum.Steps),
  },
  {
    key: FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime,
    value: FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime,
    nameDisplay: uncamelize(FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime),
  },
]
