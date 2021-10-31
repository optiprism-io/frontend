<template>
  <li class="pf-c-menu__list-item" :class="isSelected() && 'pf-c-menu__list-item--selected'">
    <a class="pf-c-menu__item" @click="$emit('click',item)" @mouseenter="$emit('hover',item)">
            <span class="pf-c-menu__item-main">
              <span class="pf-c-menu__item-text">{{ text }}</span>
            </span>
    </a>
  </li>
</template>

<script lang="ts" setup>


const props = defineProps<{
  item: any;
  selected?: any;
  text: string;
}>()

const emit = defineEmits<{
  (e: 'click', item: any): void
  (e: 'hover', item: any): void
}>()

const isSelected = () => {
  if (!props.selected) {
    return false
  }

  return props.item === props.selected;
}
</script>

<style scoped>
.pf-c-menu__list-item--selected {
  background-color: var(--pf-c-menu__list-item--hover--BackgroundColor);
}
</style>