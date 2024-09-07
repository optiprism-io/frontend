<template>
  <div class="ui-data-picker-wrapper">
    <UiDatePicker
      :value="calendarValue"
      :last-count="props.last"
      :active-tab-controls="props.type"
      @on-apply="onApply"
    >
      <template #action>
        <button
          class="pf-v5-c-toggle-group__button"
          :class="{
            'pf-v5-m-selected': props.isPeriodActive,
          }"
          type="button"
        >
          <div class="pf-v5-u-display-flex pf-v5-u-align-items-center">
            <UiIcon :icon="'far fa-calendar-alt'" />
            &nbsp;
            {{ valueString }}
          </div>
        </button>
      </template>
    </UiDatePicker>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'

import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

import { getStringDateByFormat } from '@/helpers/getStringDates'
import { TimeTypeEnum } from '@/hooks/usePeriod'

import type { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import type { I18N } from '@/utils/i18n'

export interface DataPickerPeriod {
  from: string
  to: string
  last: number
  type: TimeTypeEnum
}

interface Props extends DataPickerPeriod {
  isPeriodActive: boolean
}

const i18n = inject('i18n') as I18N

const props = withDefaults(defineProps<Props>(), {
  from: '',
  to: '',
  type: TimeTypeEnum.Last,
  last: 30,
})

const emit = defineEmits<{
  (e: 'on-apply', period: DataPickerPeriod, controlsPeriod: string): void
}>()

const calendarValue = computed(() => {
  return {
    from: props.from,
    to: props.to,
    multiple: false,
    dates: [],
  }
})

const valueString = computed(() => {
  if (props.isPeriodActive) {
    switch (props.type) {
      case 'last':
        return `${i18n.$t('common.calendar.last')} ${props.last} ${i18n.$t(props.last === 1 ? 'common.calendar.day' : 'common.calendar.days')}`
      case 'since':
        return `${i18n.$t('common.calendar.since')} ${getStringDateByFormat(props.from, '%d %b, %Y')}`
      case 'between':
        return `${getStringDateByFormat(props.from, '%d %b, %Y')} - ${getStringDateByFormat(props.to, '%d %b, %Y')}`
      default:
        return i18n.$t('common.custom')
    }
  } else {
    return i18n.$t('common.custom')
  }
})

const onApply = (payload: ApplyPayload): void => {
  emit(
    'on-apply',
    {
      from: payload.value.from || '',
      to: payload.value.to || '',
      type: payload.type,
      last: payload.last,
    },
    'calendar'
  )
}
</script>
