<template>
    <div class="pf-l-flex pf-m-column">
        <Filter
            v-for="(filter, index) in filters"
            :key="index"
            :filter="filter"
            :index="index"
            @remove-filter="removeFilter"
            @change-filter-ref="changeFilterRef"
            @change-filter-operation="changeFilterOperation"
            @add-filter-value="addFilterValue"
            @remove-filter-value="removeFilterValue"
        />
        <div class="pf-l-flex">
            <RefSelect @select="addFilter">
                <UiButton
                    class="pf-m-main"
                    :is-link="true"
                    :before-icon="'fas fa-plus'"
                >
                    Add Filter
                </UiButton>
            </RefSelect>
        </div>
    </div>
</template>

<script setup lang="ts">
import { OperationId, PropertyRef, Value } from "../../../types";
import RefSelect from "./RefSelect.vue";
import Filter from "./Filter.vue";
import {
    FilterRef,
    filtersStore as newFiltersStore
} from "../../../stores/eventSegmentation/filters";
import UiButton from "@/components/uikit/UiButton.vue";

const filtersStore = newFiltersStore();
const filters = filtersStore.filters;

const addFilter = (ref: FilterRef): void => {
    filtersStore.addFilter(ref);
};

const removeFilter = (idx: number): void => {
    filtersStore.removeFilter(idx);
};

const changeFilterRef = (filterIdx: number, ref: FilterRef) => {
    filtersStore.changeFilterRef(filterIdx, ref);
};

const changeFilterOperation = (filterIdx: number, opId: OperationId) => {
    filtersStore.changeFilterOperation(filterIdx, opId);
};

const addFilterValue = (filterIdx: number, value: Value) => {
    filtersStore.addFilterValue(filterIdx, value);
};

const removeFilterValue = (filterIdx: number, value: Value) => {
    filtersStore.removeFilterValue(filterIdx, value);
};
</script>
