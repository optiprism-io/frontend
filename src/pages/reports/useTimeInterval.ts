import { ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { UiSelectItem } from '@/components/uikit/UiSelect.vue'

import { TimeUnit } from '@/api'

import type { LocationQueryValue } from 'vue-router'

export const TIME_INTERVAL_VALUES: UiSelectItem<TimeUnit>[] = Object.values(TimeUnit).map(key => ({
  key,
  nameDisplay: key,
  value: key,
}))

export const QUERY_TIME_INTERVAL = 'timeInterval'

export function useTimeInterval() {
  const route = useRoute()
  const router = useRouter()

  const timeInterval = ref<TimeUnit>(
    validateRouteQuery(route.query[QUERY_TIME_INTERVAL]) || TimeUnit.Day
  )

  const selectTimeInterval = (payload: TimeUnit) => {
    timeInterval.value = payload
    router.push({ query: { ...route.query, [QUERY_TIME_INTERVAL]: payload } })
  }

  function validateRouteQuery(payload: LocationQueryValue | LocationQueryValue[]): TimeUnit | null {
    if (Object.values(TimeUnit).some((key: TimeUnit) => key === payload)) {
      return payload as TimeUnit
    }

    return null
  }

  return {
    timeInterval,
    selectTimeInterval,
  }
}
