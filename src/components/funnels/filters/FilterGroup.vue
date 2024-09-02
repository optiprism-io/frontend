<template>
  <div v-if="filterGroup" class="pf-l-flex pf-m-column">
    <UiActionList v-if="showMatch">
      <template #main>
        <div class="pf-l-flex">
          <span class="pf-l-flex__item">match</span>
          <UiSelectMatch
            :items="conditionsItems"
            :show-search="false"
            :value="filterGroup.condition"
            @update:model-value="changeFilterGroupCondition"
          >
            <UiButton class="pf-m-secondary pf-l-flex__item" :is-link="true">
              {{ $t(`filters.conditions.${filterGroup.condition}`) }}
            </UiButton>
          </UiSelectMatch>
          <span class="pf-l-flex__item">in group</span>
        </div>
      </template>
      <UiActionListItem @click="removeFilterGroup">
        <VTooltip popper-class="ui-hint">
          <UiIcon icon="fas fa-times" />
          <template #popper>
            <span>Remove group</span>
          </template>
        </VTooltip>
      </UiActionListItem>
    </UiActionList>
    <div class="pf-l-flex pf-m-column">
      <Filter
        v-for="(filter, i) in filterGroup.filters"
        :key="i"
        :index="i"
        :filter="filter"
        :event-refs="eventRefs"
        :hide-prefix="i === 0"
        @on-click-value="updateValue"
        @remove-filter="removeFilterForGroup(i)"
        @change-filter-property="changeFilterPropertyForGroup"
        @change-filter-operation="changeFilterOperationForGroup"
        @add-filter-value="addFilterValueForGroup"
        @remove-filter-value="removeFilterValueForGroup"
        @change-all-values="changeAllValues"
      >
        <template #prefix>
          {{ filterGroup.condition }}
        </template>
      </Filter>
      <div class="pf-l-flex">
        <PropertySelect :is-open-mount="false" @select="addFilterToGroup">
          <UiButton :is-link="true" before-icon="fas fa-plus">
            {{ $t('common.addFilter') }}
          </UiButton>
        </PropertySelect>
        <UiButton
          v-if="
            index === filterGroupsStore.filterGroups.length - 1 &&
              filterGroupsStore.isFiltersAdvanced
          "
          :is-link="true"
          before-icon="fas fa-plus"
          @click="filterGroupsStore.addFilterGroup"
        >
          {{ $t('filters.addGroup') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'

import { Tooltip as VTooltip } from 'floating-vue'

import Filter from '@/components/events/Filter.vue'
import PropertySelect from '@/components/events/PropertySelect.vue'
import UiActionList from '@/components/uikit/UiActionList/UiActionList.vue'
import UiActionListItem from '@/components/uikit/UiActionList/UiActionListItem.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

import { DataType, EventGroupedFiltersGroupsConditionEnum } from '@/api'
import { UiSelectGeneric } from '@/components/uikit/UiSelect/UiSelectGeneric'
import { useFilter } from '@/hooks/useFilter'
import { useStepsStore } from '@/stores/funnels/steps'
import {
  filterConditions,
  useFilterGroupsStore,
} from '@/stores/reports/filters'
import { operationById } from '@/types'
import { OperationId } from '@/types'

import type { UiSelectItemInterface } from '@/components/uikit/UiSelect/types'
import type { FilterGroup } from '@/stores/reports/filters';
import type { Value } from '@/types';
import type { PropertyRef } from '@/types/events'
import type { I18N } from '@/utils/i18n'

interface IProps {
  index: number
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  (e: 'input'): void
}>()

const UiSelectMatch = UiSelectGeneric<EventGroupedFiltersGroupsConditionEnum>()

const filterGroupsStore = useFilterGroupsStore()
const stepsStore = useStepsStore()
const filterHelpers = useFilter()
const { $t } = inject('i18n') as I18N

const showMatch = computed(() => filterGroupsStore.isFiltersAdvanced)

const eventRefs = computed(() => {
  return stepsStore.steps
    .map(step => {
      return step.events.map(event => {
        return event.event
      })
    })
    .flat()
})

const filterGroup = computed<FilterGroup | null>(() => {
  return filterGroupsStore.filterGroups[props.index] ?? null
})

const conditionsItems = computed<UiSelectItemInterface<EventGroupedFiltersGroupsConditionEnum>[]>(() => {
  const conditions =
    (filterGroup.value?.filters.length ?? 0) > 1
      ? filterConditions
      : filterConditions.filter(item => item === EventGroupedFiltersGroupsConditionEnum.And)

  return conditions.map(item => ({
    __type: 'item',
    id: item,
    label: $t(`filters.conditions.${item}`),
    value: item,
  }))
})

const removeFilterGroup = (): void => {
  filterGroupsStore.removeFilterGroup(props.index)
}

const changeFilterGroupCondition = (condition: EventGroupedFiltersGroupsConditionEnum): void => {
  filterGroupsStore.changeFilterGroupCondition({
    index: props.index,
    condition,
  })
}

const addFilterToGroup = async (payload: PropertyRef): Promise<void> => {
  filterGroupsStore.addFilterToGroup({
    index: props.index,
    filter: {
      propRef: payload,
      opId: OperationId.Eq,
      values: [],
      valuesList: [],
    },
  })
}

const removeFilterForGroup = (filterIndex: number): void => {
  filterGroupsStore.removeFilterForGroup({
    index: props.index,
    filterIndex,
  })
  emit('input')
}

const changeFilterPropertyForGroup = async (
  filterIndex: number,
  payload: PropertyRef
): Promise<void> => {
  filterGroupsStore.editFilterForGroup({
    index: props.index,
    filterIndex,
    filter: {
      propRef: payload,
    },
  })
}

const changeFilterOperationForGroup = (filterIndex: number, opId: OperationId): void => {
  filterGroupsStore.editFilterForGroup({
    index: props.index,
    filterIndex,
    filter: {
      opId,
    },
  })
  if (opId === OperationId.Empty || opId === OperationId.Exists) {
    emit('input')
  }
}

const updateValue = async (filterIndex: number) => {
  const filter = filterGroup.value?.filters[filterIndex]
  if (filter?.propRef) {
    const valuesList = (await filterHelpers.getValues(filter.propRef)) || []

    filterGroupsStore.editFilterForGroup({
      index: props.index,
      filterIndex,
      filter: {
        propRef: filter.propRef,
        valuesList,
      },
    })
  }
}

const addFilterValueForGroup = (filterIdx: number, value: Value) => {
  const operationId = filterGroup.value?.filters[filterIdx].opId
  const operationsSelect = operationById?.get(operationId || 'empty')
  const isStringTypeValue = (operationsSelect?.dataTypes || []).includes(DataType.String)
  const values = isStringTypeValue
    ? [value]
    : [...(filterGroup.value?.filters[filterIdx].values ?? []), value]

  filterGroupsStore.editFilterForGroup({
    index: props.index,
    filterIndex: filterIdx,
    filter: {
      values,
    },
  })

  emit('input')
}

const setValues = (filterIdx: number, values: Value[]) => {
  filterGroupsStore.editFilterForGroup({
    index: props.index,
    filterIndex: filterIdx,
    filter: {
      values,
    },
  })

  emit('input')
}

const removeFilterValueForGroup = (filterIdx: number, value: Value) => {
  const values = filterGroup.value?.filters[filterIdx].values.filter(item => item !== value) || []

  setValues(filterIdx, values)
}

const changeAllValues = (filterIdx: number, values: Value[]) => {
  setValues(filterIdx, values)
}
</script>
