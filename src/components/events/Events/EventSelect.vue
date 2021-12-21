<template>
    <Select :items="items" grouped :selected="selectedItem" @select="select">
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import { CustomEvent, Event, EventRef, customEventRef, eventRef } from "../../../types";
import Select, { Group, Item } from "../../Select/Select.vue";
import { lexiconStore } from "../../../stores/lexicon";
import { computed, ref } from "vue";

const lexicon = lexiconStore();

const props = defineProps<{
    selected?: EventRef;
}>();

const emit = defineEmits<{
    (e: "select", ref: EventRef): void;
}>();

const items = computed((): Group[] => {
    let ret: Group[] = [];

    if (lexicon.customEvents.length > 0) {
        let items: Item[] = [];
        lexicon.customEvents.forEach((e: CustomEvent) => {
            items.push({ item: customEventRef(e), name: e.name });
        });
        ret.push({ name: "Custom Events", items: items });
    }

    lexicon.events.forEach((e: Event) => {
        e.tags.forEach((tag: string) => {
            let dst = ret.find((g: Group) => g.name == tag);
            let item = { item: eventRef(e), name: e.name };
            if (!dst) {
                ret.push({ name: tag, items: [item] });
            } else {
                dst.items.push(item);
            }
        });
    });

    return ret;
});

let selectedItem = computed(() => {
    if (props.selected) {
        return props.selected;
    } else {
        return items?.value[0]?.items[0]?.item;
    }
});

const select = (item: EventRef) => {
    emit("select", item);
};
</script>
