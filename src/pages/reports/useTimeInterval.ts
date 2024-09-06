import { ref } from 'vue'

import type { UiSelectItem } from '@/components/uikit/UiSelect.vue'

import { TimeUnit } from '@/api'

export const TIME_INTERVAL_VALUES: UiSelectItem<TimeUnit>[] = Object.values(TimeUnit).map(key => ({
  key,
  nameDisplay: key,
  value: key,
}))

export function useTimeInterval() {
  const timeInterval = ref<TimeUnit>('day')

  const selectTimeInterval = (payload: TimeUnit) => {
    timeInterval.value = payload
  }

  return {
    timeInterval,
    selectTimeInterval,
  }
}
