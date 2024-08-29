import { computed, ref } from 'vue'

import type { UiSelectItem } from '@/components/uikit/UiSelect.vue'

import { TimeUnit } from '@/api'
import useI18n from '@/hooks/useI18n'

export function useTimeInterval() {
  const { t } = useI18n()

  const timeInterval = ref<TimeUnit>('day')

  const timeIntervalValues: UiSelectItem<TimeUnit>[] = Object.values(TimeUnit).map(key => ({
    key,
    nameDisplay: key,
    value: key,
  }))

  const timeIntervalText = computed(() => {
    return t('common.groupBy') + ' ' + timeInterval.value
  })

  const selectTimeInterval = (payload: TimeUnit) => {
    timeInterval.value = payload
  }

  return {
    timeInterval,
    timeIntervalValues,
    timeIntervalText,
    selectTimeInterval,
  }
}
