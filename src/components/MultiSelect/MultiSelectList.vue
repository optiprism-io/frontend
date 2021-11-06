<template>
  <div class="pf-c-menu pf-m-plain pf-m-scrollable">
    <div class="pf-c-menu__search">
      <div class="pf-c-menu__search-input">
        <input
            class="pf-c-form-control pf-m-search"
            type="search"
            id="-search-input"
            name="-search-input"
            aria-label="Search"
        />
      </div>
    </div>
    <div class="pf-c-menu__content">
      <ul class="pf-c-menu__list">
        <MultiSelectListItem v-for="item in items"
                             :item="item.item"
                             :text="item.name"
                             :selected="isSelected(item.item)"
                             @select="select"
                             @deselect="deselect"

        ></MultiSelectListItem>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Item} from "./MultiSelect.vue";
import MultiSelectListItem from "./MultiSelectListItem.vue"
import {ref} from "vue";

const props = defineProps<{
  items: Item[];
  selected?: any[];
}>()

const emit = defineEmits<{
  (e: 'select', item: any): void
  (e: 'deselect', item: any): void
}>()


const select = (item: any): void => {
  emit('select', item);
}

const deselect = (item: any): void => {
  emit('deselect', item);
}

const isSelected = (item: any): boolean => {
  return props.selected?.find((v: any) => v === item) !== undefined;
}
</script>