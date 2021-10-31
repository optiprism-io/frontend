<template>
  <Popper placement="bottom-start" :key="key" ref="popper">
    <slot></slot>
    <template #content={close}>
      <div class="pf-c-card pf-m-compact pf-u-min-width" style="--pf-u-min-width--MinWidth: 700px;">
        <div class="pf-l-grid pf-m-all-6-col">
          <div class="pf-l-grid__item event-select__select">
            <SelectList :groupedItems="groupedItems" @select="select($event,close)" @hover="hover"
                        :selected="selectedItem"/>
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
import Popper from "../../vue3-popper";
import SelectList from "./SelectList.vue";
import {ref} from "vue";

export interface Item {
  item: any;
  name: string
}

export interface Group {
  name: string;
  items: Item[];
}

const emit = defineEmits<{
  (e: 'select', item: any): void
}>()

const props = defineProps<{
  groupedItems: Group[];
  selected?: any;
}>();

let key = ref(0);

// this way we're able te change initially selected item on hover
let selectedItem = ref(props.selected)

const select = (item: any, close: () => void): void => {
  close();
  key.value++;
  emit('select', item);
}

const hover = (item: any): void => {
  selectedItem.value = item
}
</script>

<style scoped>
.event-select__description {
  border-left: 1px solid #d2d2d2;
}
</style>