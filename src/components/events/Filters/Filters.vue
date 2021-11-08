<template>
  <div class="pf-l-flex pf-m-column">
    <Filter
        v-for="(filter,index) in filtersFilters"
        :filter="filter"
        :index="index"
        @removeFilter="removeFilter"
        @changeFilterProperty="changeFilterProperty"
        @changeFilterOperation="changeFilterOperation"
        @addFilterValue="addFilterValue"
        @removeFilterValue="removeFilterValue"
    />
    <div class="pf-l-flex">
      <PropertySelect @select="addFilter">
        <button class="pf-c-button pf-m-primary" type="button">
          <span class="pf-c-button__icon pf-m-start">
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
          </span>
          Add Filter
        </button>
      </PropertySelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import {OperationId, PropertyRef, Value} from '../../../types'
import PropertySelect from "./PropertySelect.vue";
import Filter from "./Filter.vue";
import {filtersStore} from "../../../stores/eventSegmentation/filters";

const filters = filtersStore();
const filtersFilters = filters.filters;

const addFilter = (propRef:PropertyRef): void => {
  filters.addFilter(propRef);
}

const removeFilter = (idx: number): void => {
  filters.removeFilter(idx);
}

const changeFilterProperty = (filterIdx: number, propRef: PropertyRef) => {
  filters.changeFilterProperty(filterIdx, propRef);
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