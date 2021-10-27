<template>
  <Popper placement="bottom-start" :key="key" ref="popper">
    <slot></slot>
    <template #content={close}>
      <div class="pf-c-card pf-m-compact pf-u-min-width" style="--pf-u-min-width--MinWidth: 700px;">
        <div class="pf-l-grid pf-m-all-6-col">
          <div class="pf-l-grid__item event-select__select">
            <EventSelectList @select="onSelectEvent($event,close)" @hover="onHoverEvent" :selected="selected"/>
          </div>
          <div class="pf-l-grid__item event-select__description">
            <div class="pf-c-card__body">df</div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script setup lang="ts">
import Popper from "../../../vue3-popper";
import EventSelectList from "./EventSelectList.vue";
import {EventRef} from "../../../types";
import {onMounted, proxyRefs, ref, toRefs, useSlots, withDefaults} from "vue";

const emit = defineEmits<{
  (e: 'select', ref: EventRef): void
}>()

const props = defineProps<{
  selected?: EventRef;
}>();

let key = ref(0);

const onSelectEvent = (ref: EventRef, close: () => void): void => {
  close();
  key.value++;
  emit('select', ref);
}

const onHoverEvent = (ref: EventRef): void => {
}
</script>

<style scoped>
.event-select__description {
  border-left: 1px solid #d2d2d2;
}
</style>