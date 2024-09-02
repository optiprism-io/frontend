<template>
  <div class="pf-c-card pf-u-p-md">
    <div class="pf-c-toolbar">
      <div class="pf-c-toolbar__content">
        <div class="pf-l-flex pf-c-toolbar__content-section pf-m-nowrap">
          <slot name="toolbar" />

          <UiToggleGroup
            :items="itemsPeriod"
            @select="selectPeriod"
          >
            <template #after>
              <UiDatePicker
                :value="calendarValue"
                :last-count="period.last"
                :active-tab-controls="period.type"
                @on-apply="applyPeriod"
              >
                <template #action>
                  <button
                    class="pf-c-toggle-group__button"
                    :class="{
                      'pf-m-selected': calendarValueString,
                    }"
                    type="button"
                  >
                    <div class="pf-u-display-flex pf-u-align-items-center">
                      <UiIcon icon="far fa-calendar-alt" />
                      &nbsp;
                      {{ calendarValueString }}
                    </div>
                  </button>
                </template>
              </UiDatePicker>
            </template>
          </UiToggleGroup>

          <UiDropdown
            class="pf-u-ml-auto"
            :items="FUNNEL_VIEWS"
            :text-button="itemText"
            @select-value="selectItem"
          />
        </div>
      </div>
    </div>

    <slot name="chart" />
  </div>

  <div class="pf-c-card pf-u-mt-md">
    <slot name="table" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrappet.vue'
import type { UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import UiDropdown from '@/components/uikit/UiDropdown.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup/UiToggleGroup.vue'

import { periodMap } from '@/configs/events/controls'
import { getLastNDaysRange } from '@/helpers/calendarHelper'
import { getStringDateByFormat, getYYYYMMDD } from '@/helpers/getStringDates'
import { FUNNEL_VIEWS } from '@/pages/reports/funnelViews'

import type { ControlsPeriod } from '@/components/funnels/view/useCalendarTime'
import type { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup/types'
import type { FunnelChartType } from '@/pages/reports/funnelViews'

interface IProps {
  funnelView: FunnelChartType
  period: DataPickerPeriod
  controlsPeriod: ControlsPeriod
}

const props = withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'change-view', payload: FunnelChartType): void
  (e: 'change-period', payload: DataPickerPeriod): void
  (e: 'change-controls-period', payload: ControlsPeriod): void
}>()

const itemText = computed(
  () => FUNNEL_VIEWS.find(c => c.value === props.funnelView)?.nameDisplay ?? ''
)

const selectItem = (value: UiDropdownItem<FunnelChartType>) => {
  emit('change-view', value.value)
}

const selectPeriod = (payload: string): void => {
  emit('change-controls-period', payload)
  initPeriod()
}

function initPeriod(): void {
  const lastNDateRange = getLastNDaysRange(20)
  emit('change-period', {
    from: getYYYYMMDD(lastNDateRange.from),
    to: getYYYYMMDD(new Date()),
    type: 'last',
    last: 20,
  })
}

const calendarValue = computed(() => {
  return {
    from: props.period.from,
    to: props.period.to,
    multiple: false,
    dates: [],
  }
})

const itemsPeriod = computed(() => {
  const config = periodMap.find(item => item.type === 'day')
  if (!config) return []

  return config.items.map(
    (key): UiToggleGroupItem<string> => ({
      key,
      nameDisplay: key + config.text,
      value: key,
      selected: key === props.controlsPeriod,
    })
  )
})

const applyPeriod = (payload: ApplyPayload): void => {
  emit('change-controls-period', 'calendar')
  emit('change-period', {
    ...props.period,
    from: payload.value.from || '',
    to: payload.value.to || '',
    type: payload.type,
    last: payload.last,
  })
}

const calendarValueString = computed(() => {
  if (props.period.from && props.period.to && props.controlsPeriod === 'calendar') {
    switch (props.period.type) {
      case 'last':
        return `Last ${props.period.last} ${props.period.last === 1 ? 'day' : 'days'}`
      case 'since':
        return `Since ${getStringDateByFormat(props.period.from, '%d %b, %Y')}`
      case 'between':
        return `${getStringDateByFormat(props.period.from, '%d %b, %Y')} - ${getStringDateByFormat(props.period.to, '%d %b, %Y')}`
      default:
        return ''
    }
  } else {
    return ''
  }
})
</script>
