<template>
  <div class="pf-l-flex pf-m-column">
    <Breakdown
        v-for="(breakdown,index) in breakdowns"
        :breakdown="breakdown"
        :index="index"
        @removeBreakdown="removeBreakdown"
        @changeBreakdown="changeBreakdown"
    />
    <div class="pf-l-flex">
      <BreakdownSelect @select="addBreakdown">
        <slot>
          <button class="pf-c-button pf-m-primary" type="button">
          <span class="pf-c-button__icon pf-m-start">
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
          </span>
            Add Breakdown
          </button>
        </slot>
      </BreakdownSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreakdownSelect from './BreakdownSelect.vue'
import Breakdown from './Breakdown.vue';
import {
  breakdownsStore as newBreakdownsStore,
  Breakdown as StoreBreakdown
} from '../../../stores/eventSegmentation/breakdowns';

const breakdownsStore = newBreakdownsStore();
const breakdowns = breakdownsStore.breakdowns;

const addBreakdown = (breakdown: StoreBreakdown): void => {
  breakdownsStore.addBreakdown(breakdown);
}

const removeBreakdown = (idx: number): void => {
  breakdownsStore.removeBreakdown(idx);
}

const changeBreakdown = (idx: number, breakdown: StoreBreakdown): void => {
  breakdownsStore.changeBreakdown(idx, breakdown);
}

</script>