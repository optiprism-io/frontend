<template>
  <VDropdown
    placement="bottom-start"
    class="multi-select"
    :container="props.popperContainer || 'body'"
  >
    <span class="multi-select__action">
      <slot />
    </span>
    <template #popper>
      <div class="multi-select__content pf-c-card pf-m-compact pf-u-min-width">
        <MultiSelectList
          :items="itemsSelect"
          :selected="selected"
          @select="select"
          @deselect="deselect"
          @search="search"
        />
      </div>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { Dropdown as VDropdown } from 'floating-vue'

import MultiSelectList from '@/components/MultiSelect/MultiSelectList.vue'

export interface Item {
    item: any;
    name: string | boolean | number;
}

const props = defineProps<{
    items: Item[];
    selected?: any;
    popperContainer?: string
}>();

const emit = defineEmits<{
    (e: 'select', item: any): void;
    (e: 'deselect', item: any): void;
    (e: 'search', payload: string): void;
}>();

const searchRef = ref('');

const itemsSelect = computed(() => {
    if (searchRef.value) {
        return props.items.filter((item: any) => {
            const name = item?.name || '';
            return name.search(searchRef.value) >= 0;
        });
    } else {
        return props.items;
    }
});

const select = (item: any): void => {
    emit('select', item);
};

const deselect = (item: any): void => {
    emit('deselect', item);
};

const search = (payload: string) => {
    searchRef.value = payload;
    emit('search', payload);
};
</script>

<style lang="scss">
.multi-select {
    &__content {
        max-width: 240px;
    }
}
.event-select__description {
    border-left: 1px solid #d2d2d2;
}
</style>
