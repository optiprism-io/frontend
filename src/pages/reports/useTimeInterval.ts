import { computed, ref } from 'vue'

import { useI18n } from 'vue-i18n'

import type { UiSelectItem } from '@/components/uikit/UiSelect.vue'

import { TimeUnit } from '@/api'

export const TIME_INTERVAL_VALUES: UiSelectItem<TimeUnit>[] = Object.values(TimeUnit).map(key => ({
  key,
  nameDisplay: key,
  value: key,
}))

export function useTimeInterval() {
  const { t } = useI18n()

  const timeInterval = ref<TimeUnit>('day')

  const timeIntervalText = computed(() => {
    return t('common.groupBy') + ' ' + timeInterval.value
  })

  const selectTimeInterval = (payload: TimeUnit) => {
    timeInterval.value = payload
  }

  return {
    timeInterval,
    timeIntervalText,
    selectTimeInterval,
  }
}