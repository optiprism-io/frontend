<template>
    <Select :selected="selectedItem" :items="items" @select="select">
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import Select, { Item } from "../../Select/Select.vue";
import { lexiconStore } from "../../../stores/lexicon";
import { computed } from "vue";

const props = defineProps<{
    selected?: number;
}>();

const emit = defineEmits<{
    (e: "select", id: number): void;
}>();

const lexicon = lexiconStore();

let items = computed((): Item[] => {
    const ret: Item[] = [];

    if (lexicon.cohorts) {
        lexicon.cohorts.forEach(cohort => ret.push({ item: cohort.id, name: cohort.name }));
    }

    return ret;
});

let selectedItem = computed(() => {
    if (props.selected) {
        return props.selected;
    } else {
        return items.value[0].item;
    }
});

const select = (item: number) => {
    emit("select", item);
};
</script>
