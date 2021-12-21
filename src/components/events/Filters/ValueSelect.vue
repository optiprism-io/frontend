<template>
    <MultiSelect :items="items" :selected="selected" @select="add" @deselect="remove">
        <slot></slot>
    </MultiSelect>
</template>

<script setup lang="ts">
import { PropertyRef, Value } from "../../../types";
import MultiSelect, { Item } from "../../MultiSelect/MultiSelect.vue";
import { computed } from "vue";
import { FilterRef } from "../../../stores/eventSegmentation/filters";

const props = withDefaults(
    defineProps<{
        filterRef: FilterRef;
        selected?: Value[];
    }>(),
    {
        selected: () => []
    }
);

const emit = defineEmits<{
    (e: "add", value: Value): void;
    (e: "remove", value: Value): void;
}>();

const items = computed((): Item[] => {
    let ret: Item[] = [];

    for (let i = 0; i < 100; i++) {
        ret.push({ item: i, name: i.toString() });
    }

    return ret;
});

const add = (value: Value) => {
    emit("add", value);
};

const remove = (value: Value) => {
    emit("remove", value);
};
</script>
