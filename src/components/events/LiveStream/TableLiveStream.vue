<template>
  <div
    class="table-live-steam pf-u-min-height"
    style="--pf-u-min-height--MinHeight: 24ch"
  >
    <UiTable
      :is-loading="liveStreamStore.loading"
      :items="tableData.tableData"
      :columns="tableData.tableColumnsValues"
      :no-data-text="strings.noDataText"
      :show-select-columns="false"
      :allow-click-cell="true"
      @on-action="onAction"
      @click-cell="clickCell"
    >
      <template #before>
        <UiToggleGroup
          :items="itemsPeriod"
          @select="onSelectPeriod"
        >
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
                    <UiIcon icon="far fa-calendar-alt" />
                    &nbsp;
                    {{ calendarValueString }}
                  </div>
                </button>
              </template>
            </UiDatePicker>
          </template>
        </UiToggleGroup>
      </template>
      <template #after>
        <Select
          :grouped="true"
          :items="itemsProperties"
          :width-auto="true"
          :multiple="true"
          @select="selectColumn"
        >
          <UiButton
            class="pf-m-control"
            after-icon="fas fa-caret-down"
          >
            {{ columnsButtonText }}
          </UiButton>
        </Select>
      </template>
    </UiTable>
    <LiveStreamEventPopup
      v-if="eventPopup"
      :id="eventPopupId"
      :name="eventPopupName"
      :groups-map="lexiconStore.groupsMap"
      @cancel="closeEventPopup"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import LiveStreamEventPopup from '@/components/events/LiveStreamEventPopup.vue'
import Select from '@/components/Select/Select.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup/UiToggleGroup.vue'

import { shortPeriodDays } from '@/components/uikit/UiCalendar/UiCalendar.config'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import useDataTable from '@/hooks/useDataTable'
import usei18n from '@/hooks/useI18n'
import useProperty from '@/hooks/useProperty'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'
import { defaultColumns, useLiveStreamStore } from '@/stores/reports/liveStream'

import type { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import type { Action, Cell } from '@/components/uikit/UiTable/UiTable'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup/types'
import type { PropertyRef } from '@/types/events'

const { t } = usei18n()
const liveStreamStore = useLiveStreamStore()
const commonStore = useCommonStore()
const lexiconStore = useLexiconStore()
const eventsStore = useEventsStore()
const { groupedProperties } = useProperty()

const createCustomEvent = 'create'
const eventName = 'eventName'

const eventPopupName = ref('')
const eventPopupId = ref<number>(0)
const eventPopup = ref(false)

const strings = {
  noDataText: t('events.noEventsFound'),
}

const itemsPeriod = computed(() => {
  return shortPeriodDays.map(
    (key): UiToggleGroupItem<string> => ({
      key,
      nameDisplay: key + t('common.calendar.dayShort'),
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

const itemsProperties = computed(() => {
  return groupedProperties.value.map(group => {
    return {
      name: group.name,
      items: group.items.map(groupItem => {
        const activeProperty = liveStreamStore.activeColumns.find(
          columnProperty =>
            columnProperty.group === groupItem.item.group &&
            columnProperty.id === groupItem.item.id &&
            columnProperty.name === groupItem.item.name
        )

        return {
          ...groupItem,
          selected: Boolean(activeProperty),
        }
      }),
    }
  })
})

const columnsButtonText = computed(
  () => `${liveStreamStore.activeColumns.length} ${t('common.columns')}`
)

const lastCount = computed(() => {
  return liveStreamStore.period.last
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
        return `${t('common.calendar.last')} ${liveStreamStore.period.last} ${t(
          liveStreamStore.period.last === 1 ? 'common.calendar.day' : 'common.calendar.days'
        )}`
      case 'since':
        return `${t('common.calendar.since')} ${getStringDateByFormat(
          liveStreamStore.period.from,
          '%d %b, %Y'
        )}`
      case 'between':
        return `${getStringDateByFormat(
          liveStreamStore.period.from,
          '%d %b, %Y'
        )} - ${getStringDateByFormat(liveStreamStore.period.to, '%d %b, %Y')}`
      default:
        return t('common.custom')
    }
  } else {
    return t('common.custom')
  }
})

const updateReport = () => {
  liveStreamStore.getReportLiveStream()
}

const onSelectPeriod = (payload: string) => {
  liveStreamStore.controlsPeriod = payload
  updateReport()
}

const selectColumn = (payload: PropertyRef) => {
  if (defaultColumns.includes(payload.name)) {
    return
  }
  const propertyIndex = liveStreamStore.activeColumns.findIndex(
    prop => prop.group === payload.group && prop.id === payload.id && prop.name === payload.name
  )
  const items = [...liveStreamStore.activeColumns]

  if (propertyIndex === -1) {
    items.push(payload)
  } else {
    items.splice(propertyIndex, 1)
  }
  liveStreamStore.toggleColumns(items)
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

const clickCell = async (cell: Cell, rowIndex: number) => {
  const row = tableData.value?.tableData[rowIndex]

  if (row) {
    const eventIdCell = row.find(item => item.key === 'Event ID' || item.key === 'event_id')
    const eventNameCell = row.find(item => item.key === 'Event' || item.key === 'event')

    if (eventIdCell?.value) {
      eventPopupId.value = +eventIdCell.value
      eventPopupName.value = (eventNameCell?.value as string) || ''
      eventPopup.value = true
    }
  }
}

const closeEventPopup = () => {
  eventPopup.value = false
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
