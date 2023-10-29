<template>
    <FilterToolbar>
        <template #content>
            <template v-if="filterGroup">
                <Filter
                    class="filter-toolbar__item"
                    v-for="(filter, i) in filterGroup.filters"
                    :key="i"
                    :index="i"
                    :filter="filter"
                    :hide-prefix="i === 0"
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
                class="filter-toolbar__item"
                :is-open-mount="false"
                @select="addFilterToGroup"
            >
                <UiButton
                    :is-link="true"
                    :before-icon="'fas fa-plus'"
                >
                    {{ $t('common.addFilter') }}
                </UiButton>
            </PropertySelect>
        </template>
    </FilterToolbar>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import { FilterGroup, useFilterGroupsStore } from '@/stores/reports/filters';
import { PropertyRef } from '@/types/events';
import { OperationId, Value } from '@/types';
import { useFilter } from '@/hooks/useFilter';

import Filter from '@/components/events/Filter.vue';
import UiButton from '@/components/uikit/UiButton.vue';
import FilterToolbar from '@/components/events/FilterToolbar.vue';
import PropertySelect from '@/components/events/PropertySelect.vue';

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
            valuesList: await filterHelpers.getValues(payload),
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
            valuesList: await filterHelpers.getValues(payload),
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