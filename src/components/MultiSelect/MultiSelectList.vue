<template>
  <div class="pf-c-menu pf-m-plain pf-m-scrollable">
    <div class="pf-c-menu__search">
      <div class="pf-c-menu__search-input">
        <input
          v-model="searchRef"
          class="pf-c-form-control pf-m-search"
          type="search"
          aria-label="Search"
          @input="search"
        >
      </div>
    </div>
    <div class="pf-c-menu__content">
      <ul class="pf-c-menu__list">
        <MultiSelectListItem
          v-for="item in items"
          :key="String(item.name)"
          :item="item.item"
          :text="String(item.name)"
          :selected="isSelected(item.item)"
          @select="select"
          @deselect="deselect"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import MultiSelectListItem from './MultiSelectListItem.vue';
import type { Item } from '@/components/MultiSelect/MultiSelect.vue';

const props = defineProps<{
    items: Item[];
    selected?: any[];
}>();

const emit = defineEmits<{
    (e: 'select', item: any): void;
    (e: 'deselect', item: any): void;
    (e: 'search', payload: any): void;
}>();

const searchRef = ref('');

const select = (item: string): void => {
    emit('select', item);
};

const deselect = (item: string): void => {
    emit('deselect', item);
};

const isSelected = (item: any): boolean => {
    return props.selected?.find((v: any) => v === item) !== undefined;
};

const search = (): void => {
    emit('search', searchRef.value);
};
</script>
