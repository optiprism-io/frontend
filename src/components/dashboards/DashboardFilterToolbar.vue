<template>
  <FilterToolbar class="dashboard-filter-toolbar pf-u-px-sm">
    <template #content>
      <template v-if="filterGroup">
        <Filter
          v-for="(filter, i) in filterGroup.filters"
          :key="i"
          class="filter-toolbar__item pf-u-mb-md"
          :index="i"
          :filter="filter"
          :hide-prefix="i === 0"
          :orientation="OrientationTypeEnum.HORIZONTAL"
          :min-width-prefix="false"
          @on-click-value="updateValue"
          @remove-filter="removeFilterForGroup(i)"
          @change-filter-property="changeFilterPropertyForGroup"
          @change-filter-operation="changeFilterOperationForGroup"
          @add-filter-value="addFilterValueForGroup"
          @remove-filter-value="removeFilterValueForGroup"
        >
          <template #prefix>
            {{ filterGroup.condition }}
          </template>
        </Filter>
      </template>
      <PropertySelect
        class="filter-toolbar__item pf-u-mb-md"
        :is-open-mount="false"
        @select="addFilterToGroup"
      >
        <UiButton
          :is-link="true"
          before-icon="fas fa-plus"
        >
          {{ $t('common.addFilter') }}
        </UiButton>
      </PropertySelect>
    </template>
  </FilterToolbar>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue';

import Filter from '@/components/events/Filter.vue';
import FilterToolbar from '@/components/events/FilterToolbar.vue';
import PropertySelect from '@/components/events/PropertySelect.vue';
import UiButton from '@/components/uikit/UiButton.vue';

import { useFilter } from '@/hooks/useFilter';
import { useFilterGroupsStore } from '@/stores/reports/filters';
import { OperationId } from '@/types';
import { OrientationTypeEnum } from '@/types/filters';

import type { FilterGroup} from '@/stores/reports/filters';
import type { Value } from '@/types';
import type { PropertyRef } from '@/types/events';

const filterGroupsStore = useFilterGroupsStore();
const filterHelpers = useFilter();
const indexGroup = 0;

const filterGroup = computed<FilterGroup | null>(() => {
    return filterGroupsStore.filterGroups[indexGroup] ?? null;
});

const addFilterToGroup = async (payload: PropertyRef): Promise<void> => {
    filterGroupsStore.addFilterToGroup({
        index: indexGroup,
        filter: {
            propRef: payload,
            opId: OperationId.Eq,
            values: [],
            valuesList: []
        }
    });
}

const removeFilterForGroup = (filterIndex: number): void => {
    filterGroupsStore.removeFilterForGroup({
        index: 0,
        filterIndex,
    });
}

const changeFilterPropertyForGroup = async (filterIndex: number, payload: PropertyRef): Promise<void> => {
    filterGroupsStore.editFilterForGroup({
        index: indexGroup,
        filterIndex,
        filter: {
            propRef: payload,
        }
    });
}

const changeFilterOperationForGroup = (filterIndex: number, opId: OperationId): void => {
    filterGroupsStore.editFilterForGroup({
        index: indexGroup,
        filterIndex,
        filter: {
            opId,
        }
    });
}

const updateValue = async (filterIndex: number) => {
    const filter = filterGroup.value?.filters[filterIndex]

    if (filter?.propRef) {
        const valuesList = await filterHelpers.getValues(filter.propRef) || []

        filterGroupsStore.editFilterForGroup({
            index: indexGroup,
            filterIndex,
            filter: {
                propRef: filter.propRef,
                valuesList,
            }
        });
    }
}

const addFilterValueForGroup = (filterIdx: number, value: Value) => {
    filterGroupsStore.editFilterForGroup({
        index: indexGroup,
        filterIndex: filterIdx,
        filter: {
            values: [
                ...filterGroup.value?.filters[filterIdx].values ?? [],
                value,
            ]
        },
    });
}

const removeFilterValueForGroup = (filterIdx: number, value: Value) => {
    filterGroupsStore.editFilterForGroup({
        index: indexGroup,
        filterIndex: filterIdx,
        filter: {
            values: filterGroup.value
                ?.filters[filterIdx]
                .values
                .filter(item => item !== value)
            ?? [],
        },
    });
}

onUnmounted(() => {
    filterGroupsStore.$reset();
});
</script>

<style lang="scss" scoped>
.dashboard-filter-toolbar {
    .pf-c-action-list__item.filter__control-item {
        margin-left: 0 !important;
    }
    .filter_horizontal .pf-c-action-list__item {
        margin-left: 0;
    }
}
</style>
