<template>
  <Select
    :selected="selectedItem"
    :items="items"
    @select="select"
  >
    <slot />
  </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Select from '@/components/Select/Select.vue';

import { useLexiconStore } from '@/stores/lexicon';

import type { Item } from '@/components/Select/SelectTypes';

const props = defineProps<{
    selected?: number;
}>();

const emit = defineEmits<{
    (e: 'select', id: number): void;
}>();

const lexiconStore = useLexiconStore();

const items = computed(() => {
    const ret: Item<number, null>[] = [];

    if (lexiconStore.cohorts) {
        lexiconStore.cohorts.forEach(cohort => ret.push({ item: cohort.id, name: cohort.name }));
    }

    return ret;
});

const selectedItem = computed(() => {
    if (props.selected) {
        return props.selected;
    } else {
        return items.value[0].item;
    }
});

const select = (item: number) => {
    emit('select', item);
};
</script>
