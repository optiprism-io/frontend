<template>
  <div class="pf-l-flex pf-m-column">
    <Filter
        v-for="(filter,index) in filtersFilters"
        :filter="filter"
        :index="index"
        @removeFilter="removeFilter"
        @changeFilterRef="changeFilterRef"
        @changeFilterOperation="changeFilterOperation"
        @addFilterValue="addFilterValue"
        @removeFilterValue="removeFilterValue"
    />
    <div class="pf-l-flex">
      <RefSelect @select="addFilter">
        <button class="pf-c-button pf-m-primary" type="button">
          <span class="pf-c-button__icon pf-m-start">
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
          </span>
          Add Filter
        </button>
      </RefSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import {OperationId, PropertyRef, Value} from '../../../types'
import RefSelect from "./RefSelect.vue";
import Filter from "./Filter.vue";
import {FilterRef, filtersStore} from "../../../stores/eventSegmentation/filters";

const filters = filtersStore();
const filtersFilters = filters.filters;

const addFilter = (ref:FilterRef): void => {
  filters.addFilter(ref);
}

const removeFilter = (idx: number): void => {
  filters.removeFilter(idx);
}

const changeFilterRef = (filterIdx: number, ref: FilterRef) => {
  filters.changeFilterRef(filterIdx, ref);
}

const changeFilterOperation = (filterIdx: number, opId: OperationId) => {
  filters.changeFilterOperation(filterIdx, opId);
}

const addFilterValue = (filterIdx: number, value: Value) => {
  filters.addFilterValue(filterIdx, value);
}

const removeFilterValue = (filterIdx: number, value: Value) => {
  filters.removeFilterValue(filterIdx, value);
}
</script>