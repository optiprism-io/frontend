<template>
    <Select
        grouped
        :items="items"
        :selected="selectedItem"
        @select="select"
    >
        <slot />
    </Select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { UserCustomProperty, UserProperty } from "@/types/events";
import Select from "@/components/Select/Select.vue";
import { Group, Item } from "@/components/Select/SelectTypes";
import { useLexiconStore } from "@/stores/lexicon";
import {
    FilterRef,
    newFilterCohort,
    newFilterUserCustomProperty,
    newFilterUserProperty
} from "@/stores/eventSegmentation/filters";

const lexiconStore = useLexiconStore();

const props = defineProps<{
    selected?: FilterRef;
}>();

const emit = defineEmits<{
    (e: "select", ref: FilterRef): void;
}>();

let items = computed((): Group[] => {
    let ret: Group[] = [];

    {
        let items: Item[] = [];
        items.push({ item: newFilterCohort(), name: "Cohort" });
        ret.push({ name: "", items: items });
    }

    if (lexiconStore.userProperties.length > 0) {
        let items: Item[] = [];
        lexiconStore.userProperties.forEach((prop: UserProperty): void => {
            items.push({
                item: newFilterUserProperty(prop.id),
                name: prop.name
            });
        });
        ret.push({ name: "User Properties", items: items });
    }

    if (lexiconStore.userCustomProperties.length > 0) {
        let items: Item[] = [];
        lexiconStore.userCustomProperties.forEach((prop: UserCustomProperty): void => {
            items.push({
                item: newFilterUserCustomProperty(prop.id),
                name: prop.name
            });
        });
        ret.push({ name: "User Custom Properties", items: items });
    }

    return ret;
});

let selectedItem = computed((): FilterRef | undefined => {
    if (props.selected) {
        return props.selected;
    } else {
        return items?.value[0]?.items[0]?.item;
    }
});

const select = (item: FilterRef) => {
    emit("select", item);
};
</script>
