<template>
  <li class="pf-c-menu__list-item" :class="isSelected() && 'pf-c-menu__list-item--selected'">
    <a class="pf-c-menu__item" @click="$emit('click',propRef)" @mouseenter="$emit('hover',propRef)">
            <span class="pf-c-menu__item-main">
              <span class="pf-c-menu__item-text">{{ text }}</span>
            </span>
    </a>
  </li>
</template>

<script lang="ts" setup>

import {EventRef, PropertyRef} from "../../../types";

const props = defineProps<{
  propRef: PropertyRef;
  selected?: PropertyRef;
  text: string;
}>()

const emit = defineEmits<{
  (e: 'click', ref: PropertyRef): void
  (e: 'hover', ref: PropertyRef): void
}>()

const isSelected = () => {
  if (!props.selected) {
    return false
  }

  return props.propRef.type == props.selected.type &&
      props.propRef.id == props.selected.id
}
</script>

<style scoped>
.pf-c-menu__list-item--selected {
  background-color: var(--pf-c-menu__list-item--hover--BackgroundColor);
}
</style>