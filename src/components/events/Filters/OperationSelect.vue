<template>
    <Select :items="items" :selected="selectedItem" @select="select">
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import { findOperations, OperationId } from "@/types";
import Select from "@/components/Select/Select.vue";
import { Item } from "@/components/Select/SelectTypes";
import { useLexiconStore } from "@/stores/lexicon";
import { computed } from "vue";
import {
    FilterRef,
    FilterRefUserProperty,
    isFilterUserCustomProperty,
    isFilterUserProperty
} from "@/stores/eventSegmentation/filters";

const lexiconStore = useLexiconStore();

const props = defineProps<{
    filterRef: FilterRef;
    selected?: OperationId;
}>();

const emit = defineEmits<{
    (e: "select", opId: OperationId): void;
}>();

const items = computed((): Item[] => {
    let ret: Item[] = [];

    if (isFilterUserProperty(props.filterRef)) {
        const prop = lexiconStore.findUserPropertyById(
            (props.filterRef as FilterRefUserProperty).id
        );
        findOperations(prop.type, prop.nullable, prop.is_array).forEach(op =>
            ret.push({
                item: op.id,
                name: op.name
            })
        );
    } else if (isFilterUserCustomProperty(props.filterRef)) {
        const prop = lexiconStore.findUserCustomPropertyById(
            (props.filterRef as FilterRefUserProperty).id
        );
        findOperations(prop.type, prop.nullable, prop.isArray).forEach(op =>
            ret.push({
                item: op.id,
                name: op.name
            })
        );
    }

    return ret;
});

let selectedItem = computed((): OperationId | undefined => {
    if (props.selected) {
        return props.selected;
    } else {
        return items?.value[0]?.item;
    }
});

const select = (opId: OperationId) => {
    emit("select", opId);
};
</script>
