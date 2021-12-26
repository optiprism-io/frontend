<template>
    <Select
        :loading="isLoading"
        :items="items"
        grouped
        :selected="selectedItem"
        @select="select"
        @on-search="onSearch"
    >
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import { CustomEvent, Event, EventRef, customEventRef, eventRef } from "../../../types";
import Select, { Group, Item } from "../../Select/Select.vue";
import { lexiconStore } from "../../../stores/lexicon";
import { computed, ref } from "vue";

const search = ref("");
const lexicon = lexiconStore();

const props = defineProps<{
    selected?: EventRef;
}>();

const emit = defineEmits<{
    (e: "select", ref: EventRef): void;
}>();

const isLoading = computed((): boolean => {
    return lexicon.eventsLoading;
});

const items = computed((): Group[] => {
    let ret: Group[] = [];

    if (lexicon.customEvents.length) {
        const items: Item[] = [];

        lexicon.customEvents.forEach((e: CustomEvent) => {
            if (search.value && !(e.name.search(search.value) >= 0)) {
                return;
            }
            items.push({ item: customEventRef(e), name: e.name });
        });

        if (items.length) {
            ret.push({ name: "Custom Events", items });
        }
    }

    lexicon.events.forEach((e: Event) => {
        e.tags.forEach((tag: string) => {
            if (search.value && !(e.name.search(search.value) >= 0)) {
                return;
            }

            let dst = ret.find((g: Group) => g.name == tag);
            let item = {
                item: eventRef(e),
                name: e.name
            };

            if (!dst) {
                ret.push({
                    name: tag,
                    items: [item]
                });
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

const onSearch = (payload: string) => {
    search.value = payload;
};
</script>
