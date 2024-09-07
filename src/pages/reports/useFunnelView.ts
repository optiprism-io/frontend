import { ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { FunnelConversionOverTimeChartTypeTypeEnum, FunnelStepsChartTypeTypeEnum } from '@/api'

import type { FunnelChartType } from '@/pages/reports/funnelViews'
import type { LocationQueryValue } from 'vue-router'

export const QUERY_VIEW = 'view'

export function useFunnelView() {
  const route = useRoute()
  const router = useRouter()

  const funnelViewId = ref<FunnelChartType>(
    validateRouteQuery(route.query[QUERY_VIEW]) || FunnelStepsChartTypeTypeEnum.Steps
  )
  function onChangeView(view: FunnelChartType) {
    funnelViewId.value = view
    router.push({ query: { ...route.query, [QUERY_VIEW]: view } })
  }

  function validateRouteQuery(
    view: LocationQueryValue | LocationQueryValue[]
  ): FunnelChartType | null {
    if (
      view === FunnelStepsChartTypeTypeEnum.Steps ||
      view === FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime
    ) {
      return view
    }

    return null
  }

  return {
    funnelViewId,
    onChangeView,
  }
}
