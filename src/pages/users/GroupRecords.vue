<template>
  <ToolsLayout :col-lg="12">
    <template #title>
      {{ strings.usersTitle }}
    </template>
    <template #main>
      <UiCardContainer>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useI18n } from 'vue-i18n'

import GroupRecordPopup from '@/components/groups/GroupRecordPopup.vue'
import Select from '@/components/Select/Select.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import type { DataPickerPeriod } from '@/components/uikit/UiDatePickerWrapper.vue'
import UiDatePickerWrapper from '@/components/uikit/UiDatePickerWrapper.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup/UiToggleGroup.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { PropertyType } from '@/api'
import { shortPeriodDays } from '@/components/uikit/UiCalendar/UiCalendar.config'
import useDataTable from '@/hooks/useDataTable'
import { getProperties } from '@/hooks/useProperty'
import { useGroupStore, defaultColumns } from '@/stores/group/group'
import { useLexiconStore } from '@/stores/lexicon'
import { useSegmentsStore } from '@/stores/reports/segments'

import type { Cell } from '@/components/uikit/UiTable/UiTable'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup/types'
import type { PropertyRef } from '@/types/events'

const { t } = useI18n()
const groupStore = useGroupStore()
const segmentsStore = useSegmentsStore()
const lexiconStore = useLexiconStore()

const strings = computed(() => {
  return {
    breakdowns: t('events.breakdowns'),
    usersTitle: t('users.title'),
    noDataText: t('events.noEventsFound'),
    dayShort: t('common.calendar.dayShort'),
    segment: t('events.segments.segment'),
    columns: t('common.columns'),
  }
})

const recordPopupName = ref('')
const recordPopupId = ref<string>('')
const recordPopup = ref(false)

const closeRecordPopup = () => {
  recordPopup.value = false
  recordPopupId.value = ''
  recordPopupName.value = ''
}

const itemsPeriod = computed(() => {
  return shortPeriodDays.map(
    (key): UiToggleGroupItem<string> => ({
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

const columnsButtonText = computed(
  () => `${groupStore.activeColumns.length} ${strings.value.columns}`
)

const itemsProperties = computed(() => {
  const group = lexiconStore.groups.find(item => +item.id === +groupStore.group)
  const properties = group ? lexiconStore.groupPropertiesMap[group.name] : []

  if (properties && group) {
    const property = getProperties(properties, group.name, PropertyType.Group, group.id)

    return [
      {
        name: property.name,
        type: 'group',
        items: property.items.map((groupItem: { name: string }) => {
          const activeProperty = groupStore.activeColumns.find(col => col.name === groupItem.name)

          return {
            ...groupItem,
            selected: Boolean(activeProperty),
          }
        }),
      },
    ]
  } else {
    return []
  }
})

const selectColumn = (payload: PropertyRef) => {
  if (defaultColumns.includes(payload.name)) {
    return
  }

  const propertyIndex = groupStore.activeColumns.findIndex(prop => prop.name === payload.name)
  const items = [...groupStore.activeColumns]

  if (propertyIndex === -1) {
    items.push(payload)
  } else {
    items.splice(propertyIndex, 1)
  }
  groupStore.toggleColumns(items)
  updateData()
}

const updateData = () => {
  groupStore.getList()
}

const clickCell = (_: Cell, rowIndex: number) => {
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
    await lexiconStore.getGroupProperties(),
  ])
}

const initPage = async () => {
  groupStore.activeColumns = ['id'].map(name => {
    const propertyData = groupStore.propertiesGrouped.find(item => item.name === name)

    const property: PropertyRef = {
      name: name,
      type: PropertyType.Group,
      group: propertyData?.groupId,
    }

    return property
  })

  segmentsStore.$reset()
  updateData()
}

onMounted(async () => {
  await initEventsAndProperties()
  initPage()
})

onUnmounted(() => {
  segmentsStore.$reset()
})

watch(
  () => groupStore.group,
  _ => {
    initPage()
  }
)
</script>
