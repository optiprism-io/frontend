<template>
  <li class="pf-c-menu__list-item" :class="isSelected() && 'pf-c-menu__list-item--selected'">
    <a class="pf-c-menu__item" @click="$emit('click',eventRef)" @mouseenter="$emit('hover',eventRef)">
            <span class="pf-c-menu__item-main">
              <span class="pf-c-menu__item-text">{{ text }}</span>
            </span>
    </a>
  </li>
</template>

<script lang="ts" setup>

import {EventRef} from "../../../types";

const props = defineProps<{
  eventRef: EventRef;
  selected?: EventRef;
  text: string;
}>()

const emit = defineEmits<{
  (e: 'click', ref: EventRef): void
  (e: 'hover', ref: EventRef): void
}>()

const isSelected = () => {
  if (!props.selected) {
    return false
  }

  return props.eventRef.type == props.selected.type &&
      props.eventRef.id == props.selected.id
}
</script>

<style scoped>
.pf-c-menu__list-item--selected {
  background-color: var(--pf-c-menu__list-item--hover--BackgroundColor);
}
</style>