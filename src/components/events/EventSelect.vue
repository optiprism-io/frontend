<template>
  <Popper placement="bottom-start">
    <slot></slot>
    <template #content>
      <div class="pf-c-card pf-m-compact pf-u-min-width" style="--pf-u-min-width--MinWidth: 700px;">
        <div class="pf-l-grid pf-m-all-6-col">
          <div class="pf-l-grid__item">
            <EventSelectList @select="onSelectEvent" @hover="onHoverEvent"/>
          </div>
          <div class="pf-l-grid__item pf-l-grid__item--left-divider">
            <div class="pf-c-card__body">df</div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script setup lang="ts">
import Popper from "vue3-popper";
import EventSelectList from "./EventSelectList.vue";
import {EventRef} from "../../types";

const emit = defineEmits<{
  (e: 'select', ref: EventRef): void
  (e: 'hover', ref: EventRef): void
}>()

const onSelectEvent = (ref: EventRef): void => {
  emit('select', ref);
}

const onHoverEvent = (ref: EventRef): void => {
  console.log(ref);
  emit('hover', ref);
}
</script>

<style scoped>
.pf-l-grid__item--left-divider {
  border-left: 1px solid #d2d2d2;
}
</style>