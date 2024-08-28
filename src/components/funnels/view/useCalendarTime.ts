import { computed, ref } from 'vue'

import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrappet.vue'

import { getRequestTime, TimeTypeEnum } from '@/helpers/periodHelper'

import type { EventRecordsListRequestTime } from '@/api'

export type ControlsPeriod = string | number

export function useCalendarTime() {
  const controlsPeriod = ref<ControlsPeriod>('30')
  const period = ref<DataPickerPeriod>({
    from: '',
    to: '',
    type: TimeTypeEnum.Last,
    last: 30,
  })

  const time = computed<EventRecordsListRequestTime>(() => {
    return getRequestTime(
      period.value.type,
      controlsPeriod.value,
      period.value.from,
      period.value.to,
      period.value.last
    )
  })

  function setControlsPeriod(payload: ControlsPeriod) {
    controlsPeriod.value = payload
  }

  function setPeriod(payload: DataPickerPeriod) {
    period.value = payload
  }

  return {
    time,
    controlsPeriod,
    period,

    setControlsPeriod,
    setPeriod,
  }
}
