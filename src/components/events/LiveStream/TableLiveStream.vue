<template>
  <div class="table-live-steam pf-u-min-height" style="--pf-u-min-height--MinHeight: 24ch">
    <UiTable
      :is-loading="liveStreamStore.loading"
      :items="tableData.tableData"
      :columns="columnsPropertues"
      :table-columns="tableData.tableColumnsValues"
      :no-data-text="$t('events.noEventsFound')"
      :show-select-columns="true"
      :default-columns="defaultColumns"
      @select-columns="selectColumns"
      @on-action="onAction"
    >
      <template #before>
        <UiToggleGroup :items="itemsPeriod" @select="onSelectPeriod">
          <template #after>
            <UiDatePicker
              :value="calendarValue"
              :last-count="lastCount"
              :active-tab-controls="liveStreamStore.period.type"
              @on-apply="onApplyPeriod"
            >
              <template #action>
                <button
                  class="pf-c-toggle-group__button"
                  :class="{
                    'pf-m-selected': liveStreamStore.isPeriodActive,
                  }"
                  type="button"
                >
                  <div class="pf-u-display-flex pf-u-align-items-center">
                    <UiIcon :icon="'far fa-calendar-alt'" />
                    &nbsp;
                    {{ calendarValueString }}
                  </div>
                </button>
              </template>
            </UiDatePicker>
          </template>
        </UiToggleGroup>
      </template>
    </UiTable>
    <LiveStreamEventPopup v-if="liveStreamStore.eventPopup" :name="eventPopupName" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import { useLiveStreamStore, defaultColumns } from '@/stores/reports/liveStream'
import { useCommonStore } from '@/stores/common'
import { useLexiconStore } from '@/stores/lexicon'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import useDataTable from '@/hooks/useDataTable'
import {
  PropertyRef
} from '@/api'

import { shortPeriodDays } from '@/components/uikit/UiCalendar/UiCalendar.config'
import { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import { Action } from '@/components/uikit/UiTable/UiTable'
import UiToggleGroup, { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue'
import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import LiveStreamEventPopup from '@/components/events/LiveStreamEventPopup.vue'

const i18n = inject<any>('i18n')
const liveStreamStore = useLiveStreamStore()
const commonStore = useCommonStore()
const lexiconStore = useLexiconStore()
const eventsStore = useEventsStore()

const actionTable = 'action'
const createCustomEvent = 'create'
const customEvents = 'customEvents'
const eventName = 'eventName'
const properties = 'properties'
const userProperties = 'userProperties'

const eventPopupName = ref('')

const itemsPeriod = computed(() => {
  return shortPeriodDays.map(
    (key): UiToggleGroupItem => ({
      key,
      nameDisplay: key + i18n.$t('common.calendar.dayShort'),
      value: key,
      selected: liveStreamStore.controlsPeriod === key,
    })
  )
})

const tableData = computed(() => {
  return useDataTable(
    {
      columns: liveStreamStore.columns?.length ? liveStreamStore.columns : [],
    },
    true,
    {}
  )
})

const lastCount = computed(() => {
  return liveStreamStore.period.last
})

const columnsPropertues = computed(() => {
  return lexiconStore.properties.map((item, i) => {
    return {
      fixed: false,
      index: i,
      lastFixed: true,
      nowrap: true,
      title: item.propertyName || '',
      value: item.propertyName || '',
      truncate: true,
    }
  })
})

const calendarValue = computed(() => {
  return {
    from: liveStreamStore.period?.from,
    to: liveStreamStore.period?.to,
    multiple: false,
    dates: [],
  }
})

const calendarValueString = computed(() => {
  if (liveStreamStore.isPeriodActive) {
    switch (liveStreamStore.period.type) {
      case 'last':
        return `${i18n.$t('common.calendar.last')} ${liveStreamStore.period.last} ${i18n.$t(liveStreamStore.period.last === 1 ? 'common.calendar.day' : 'common.calendar.days')}`
      case 'since':
        return `${i18n.$t('common.calendar.since')} ${getStringDateByFormat(liveStreamStore.period.from, '%d %b, %Y')}`
      case 'between':
        return `${getStringDateByFormat(liveStreamStore.period.from, '%d %b, %Y')} - ${getStringDateByFormat(liveStreamStore.period.to, '%d %b, %Y')}`
      default:
        return i18n.$t('common.custom')
    }
  } else {
    return i18n.$t('common.custom')
  }
})

const selectColumns = (payload: string[]) => {
  liveStreamStore.toggleColumns(
    payload.map((key) => {
      return lexiconStore.properties.find(property => property.propertyName === key) as PropertyRef
    })
  )

  updateReport()
}

const updateReport = () => {
  liveStreamStore.getReportLiveStream()
}

const onSelectPeriod = (payload: string) => {
  liveStreamStore.controlsPeriod = payload
  updateReport()
}

const onApplyPeriod = (payload: ApplyPayload): void => {
  liveStreamStore.controlsPeriod = 'calendar'
  liveStreamStore.period = {
    ...liveStreamStore.period,
    from: payload.value.from || '',
    to: payload.value.to || '',
    type: payload.type,
    last: payload.last,
  }

  updateReport()
}

const onAction = (payload: Action) => {
  if (payload.name === createCustomEvent) {
    eventsStore.setEditCustomEvent(null)
    commonStore.togglePopupCreateCustomEvent(true)
  }

  if (payload.type === 'event') {
    eventsStore.setEditCustomEvent(Number(payload.name))
    commonStore.togglePopupCreateCustomEvent(true)
  }

  if (payload.type === eventName) {
    eventPopupName.value = payload.name
    liveStreamStore.eventPopup = true
  }
}
</script>

<style lang="scss">
.table-live-steam {
  --table-live-steam-cell-width: 200px;

  .pf-c-table__sticky-column {
    &:nth-child(1) {
      min-width: var(--table-live-steam-cell-width);
      max-width: var(--table-live-steam-cell-width);
      left: 0;
    }

    &:nth-child(2) {
      min-width: 440px;
      width: 440px;
      left: 200px;
    }

    &:nth-child(3) {
      min-width: var(--table-live-steam-cell-width);
      left: 640px;
    }
  }

  .pf-u-text-nowrap {
    min-width: 140px;
    max-width: 350px;
  }
}
</style>
