<template>
  <Popper placement="bottom-start" :key="key" ref="popper">
    <slot></slot>
    <template #content={close}>
      <div class="pf-c-card pf-m-compact pf-u-min-width" style="--pf-u-min-width--MinWidth: 700px;">
        <div class="pf-l-grid pf-m-all-6-col">
          <div class="pf-l-grid__item property-select__select">
            <PropertySelectList @select="selectProperty($event,close)" @hover="hoverProperty" :selected="selected" :event-ref="eventRef"/>
          </div>
          <div class="pf-l-grid__item property-select__description">
            <div class="pf-c-card__body">df</div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script setup lang="ts">
import Popper from "../../../vue3-popper";
import PropertySelectList from "./PropertySelectList.vue";
import {EventRef, PropertyRef} from "../../../types";
import {onMounted, proxyRefs, ref, toRefs, useSlots, withDefaults} from "vue";

const emit = defineEmits<{
  (e: 'select', ref: PropertyRef): void
}>()

const props = defineProps<{
  eventRef: EventRef;
  selected?: PropertyRef;
}>();

let key = ref(0);

const selectProperty = (ref: PropertyRef, close: () => void): void => {
  close();
  key.value++;
  emit('select', ref);
}

const hoverProperty = (ref: PropertyRef): void => {
}
</script>

<style scoped>
.property-select__description {
  border-left: 1px solid #d2d2d2;
}
</style>