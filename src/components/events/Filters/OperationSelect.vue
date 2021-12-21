<template>
    <Select :items="items" :selected="selectedItem" @select="select">
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import { findOperations, OperationId, UserCustomProperty } from "../../../types";
import Select, { Group, Item } from "../../Select/Select.vue";
import { lexiconStore } from "../../../stores/lexicon";
import { computed, ref } from "vue";
import {
    FilterRef,
    FilterRefUserProperty,
    isFilterUserCustomProperty,
    isFilterUserProperty
} from "../../../stores/eventSegmentation/filters";

const lexicon = lexiconStore();

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
        const prop = lexicon.findUserPropertyById((props.filterRef as FilterRefUserProperty).id);
        findOperations(prop.type, prop.nullable, prop.is_array).forEach(op =>
            ret.push({
                item: op.id,
                name: op.name
            })
        );
    } else if (isFilterUserCustomProperty(props.filterRef)) {
        const prop = lexicon.findUserCustomPropertyById(
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
