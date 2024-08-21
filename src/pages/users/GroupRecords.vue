<template>
  <ToolsLayout :col-lg="12">
    <template #title>
      {{ strings.usersTitle }}
    </template>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
        <UiTable
          :items="tableData.rows"
          :columns="tableData.tableColumnsValues"
          :no-data-text="strings.noDataText"
          :allow-click-cell="true"
          :is-loading="groupStore.loading"
          @click-cell="clickCell"
        >
          <template #before>
            <UiToggleGroup
              :items="itemsPeriod"
              @select="onSelectPeriod"
            >
              <template #after>
                <UiDatePickerWrapper
                  :is-period-active="groupStore.isPeriodActive"
                  :from="groupStore.period.from"
                  :to="groupStore.period.to"
                  :last="groupStore.period.last"
                  :type="groupStore.period.type"
                  @on-apply="onSelectData"
                />
              </template>
            </UiToggleGroup>
          </template>
        </UiTable>
      </UiCardContainer>
    </template>
  </ToolsLayout>
  <GroupRecordPopup
    v-if="recordPopup"
    :id="recordPopupId"
    :name="recordPopupName"
    :group="groupStore.group"
    @cancel="closeRecordPopup"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import GroupRecordPopup from '@/components/groups/GroupRecordPopup.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrapper.vue'
import UiDatePickerWrapper from '@/components/uikit/UiDatePickerWrapper.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { shortPeriodDays } from '@/components/uikit/UiCalendar/UiCalendar.config'
import useDataTable from '@/hooks/useDataTable'
import useI18n from '@/hooks/useI18n'
import { useGroupStore } from '@/stores/group/group'
import { useLexiconStore } from '@/stores/lexicon'
import { useReportsStore } from '@/stores/reports/reports'
import { useSegmentsStore } from '@/stores/reports/segments'

import type { Cell } from '@/components/uikit/UiTable/UiTable'

const { t } = useI18n()
const groupStore = useGroupStore()
const segmentsStore = useSegmentsStore()
const lexiconStore = useLexiconStore()
const reportsStore = useReportsStore()

const strings = computed(() => {
  return {
    breakdowns: t('events.breakdowns'),
    usersTitle: t('users.title'),
    noDataText: t('events.noEventsFound'),
    dayShort: t('common.calendar.dayShort'),
    segment: t('events.segments.segment'),
  }
})

const recordPopupName = ref('')
const recordPopupId = ref<number | string>(0)
const recordPopup = ref(false)

const closeRecordPopup = () => {
  recordPopup.value = false
  recordPopupId.value = 0
  recordPopupName.value = ''
}

const itemsPeriod = computed(() => {
  return shortPeriodDays.map(
    (key): UiToggleGroupItem => ({
      key,
      nameDisplay: key + strings.value.dayShort,
      value: key,
      selected: groupStore.controlsPeriod === key,
    })
  )
})

const tableData = computed(() => {
  return useDataTable({ columns: groupStore.columns }, true, {})
})

const updateData = () => {
  groupStore.getList()
}

const clickCell = (cell: Cell, rowIndex: number) => {
  const rowCell = tableData.value?.rows[rowIndex]?.find(cell => cell.key === 'ID')
  const cellValue = String(rowCell?.value) || ''

  recordPopupId.value = String(cellValue)
  recordPopupName.value = cellValue
  recordPopup.value = true
}

const onSelectPeriod = (payload: string) => {
  groupStore.controlsPeriod = payload
  updateData()
}

const onSelectData = (payload: DataPickerPeriod, controlsPeriod: string) => {
  groupStore.controlsPeriod = controlsPeriod
  groupStore.period = {
    ...groupStore.period,
    from: payload.from || '',
    to: payload.to || '',
    type: payload.type,
    last: payload.last,
  }

  updateData()
}

const initEventsAndProperties = async () => {
  await Promise.all([
    lexiconStore.getEvents(),
    lexiconStore.getEventProperties(),
    await lexiconStore.getGroups(),
    lexiconStore.getGroupProperties(),
  ])
}

onMounted(async () => {
  await initEventsAndProperties()
  reportsStore.getList()
  segmentsStore.$reset()
  updateData()
})

onUnmounted(() => {
  segmentsStore.$reset()
})
</script>
