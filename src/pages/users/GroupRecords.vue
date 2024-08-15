<template>
  <ToolsLayout :col-lg="12">
    <template #title>
      {{ $t('users.title') }}
    </template>
    <UiCard
      class="pf-c-card pf-m-compact pf-u-h-100"
      :title="strings.segment"
    >
      <Segments
        :is-one="true"
        :hide-add-segment-button="true"
        @get-event-segmentation="updateData"
      />
    </UiCard>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
        <UiTable
          :items="tableData.tableData"
          :columns="tableData.tableColumnsValues"
          :no-data-text="strings.noDataText"
          :allow-click-cell="true"
          :is-loading="groupStore.loading"
          @on-action="onAction"
          @click-cell="clickCell"
        >
          <template #before>
            <UiToggleGroup
              :items="itemsPeriod"
              @select="onSelectPeriod"
            >
              <template #after>
                <UiDatePickerWrappet
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
  <PropertiesManagementPopup
    v-if="groupStore.propertyPopup"
    :item="selectedItems"
    :item-index="selectedItemsIndex"
    @apply="onClosePropertyPopup"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import Segments from '@/components/events/Segments/Segments.vue'
import PropertiesManagementPopup from '@/components/groups/PropertiesManagementPopup.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrappet.vue'
import UiDatePickerWrappet from '@/components/uikit/UiDatePickerWrappet.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { shortPeriodDays } from '@/components/uikit/UiCalendar/UiCalendar.config'
import useDataTable from '@/hooks/useDataTable'
import useI18n from '@/hooks/useI18n'
import { useGroupStore } from '@/stores/group/group'
import { useLexiconStore } from '@/stores/lexicon'
import { useSegmentsStore } from '@/stores/reports/segments'

import type { GroupRecord } from '@/api'
import type { Action, Cell } from '@/components/uikit/UiTable/UiTable'

const { t } = useI18n()
const groupStore = useGroupStore()
const segmentsStore = useSegmentsStore()
const lexiconStore = useLexiconStore()

const strings = computed(() => {
  return {
    noDataText: t('events.noEventsFound'),
    dayShort: t('common.calendar.dayShort'),
    segment: t('events.segments.segment'),
  }
})

const selectedItems = ref<GroupRecord | null>(null)
const selectedItemsIndex = ref<number>()

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

const clickCell = (call: Cell, rowIndex: number) => {
  // TODO
}

const onAction = (payload: Action) => {
  const index = groupStore.items.findIndex((_, i) => i === payload.type)

  if (index >= 0) {
    selectedItems.value = groupStore.items[index]
    selectedItemsIndex.value = index
  }

  groupStore.propertyPopup = true
}

const updateData = () => {
  groupStore.getList()
}

const onSelectPeriod = (payload: string) => {
  groupStore.controlsPeriod = payload
  updateData()
}

const onClosePropertyPopup = () => {
  selectedItems.value = null
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

onMounted(() => {
  lexiconStore.getEventProperties()
  segmentsStore.$reset()
  segmentsStore.segments.push({
    name: '',
    conditions: [
      {
        filters: [],
      },
    ],
  })
  updateData()
})

onUnmounted(() => {
  segmentsStore.$reset()
})
</script>
