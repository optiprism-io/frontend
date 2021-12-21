<template>
    <Select :items="items" :selected="selectedItem" @select="select">
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import { findOperations, OperationId, PropertyRef, PropertyType } from "../../../types";
import Select, { Group, Item } from "../../Select/Select.vue";
import { lexiconStore } from "../../../stores/lexicon";
import { computed, ref } from "vue";

const lexicon = lexiconStore();

const props = defineProps<{
    propertyRef: PropertyRef;
    selected?: OperationId;
}>();

const emit = defineEmits<{
    (e: "select", opId: OperationId): void;
}>();

const items = computed((): Item[] => {
    let ret: Item[] = [];

    if (props.propertyRef.type === PropertyType.Event) {
        const prop = lexicon.findEventPropertyById(props.propertyRef.id);
        findOperations(prop.type, prop.nullable, prop.is_array).forEach(op =>
            ret.push({
                item: op.id,
                name: op.name
            })
        );
    } else if (props.propertyRef.type === PropertyType.EventCustom) {
        const prop = lexicon.findEventCustomPropertyById(props.propertyRef.id);
        findOperations(prop.type, prop.nullable, prop.is_array).forEach(op =>
            ret.push({
                item: op.id,
                name: op.name
            })
        );
    } else if (props.propertyRef.type === PropertyType.User) {
        const prop = lexicon.findUserPropertyById(props.propertyRef.id);
        findOperations(prop.type, prop.nullable, prop.is_array).forEach(op =>
            ret.push({
                item: op.id,
                name: op.name
            })
        );
    } else if (props.propertyRef.type === PropertyType.UserCustom) {
        const prop = lexicon.findUserCustomPropertyById(props.propertyRef.id);
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
