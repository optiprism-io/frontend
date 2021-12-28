<template>
    <Select
        grouped
        :loading="isLoading"
        :items="itemsWithSearch"
        :selected="selectedItem"
        @select="select"
        @on-search="onSearch"
        @on-hover="onHover"
    >
        <slot></slot>
        <template v-if="selectedDescription" #description>
            {{ selectedDescription }}
        </template>
    </Select>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { EventRef } from "@/types";
import Select from "@/components/Select/Select.vue";
import { Group, Item } from "@/components/Select/SelectTypes";

const search = ref("");
const description = ref("");

interface Props {
    selected?: EventRef | undefined | null;
    items: Group[];
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    selected: null,
    items: () => []
});

const emit = defineEmits<{
    (e: "select", ref: EventRef): void;
}>();

const itemsWithSearch = computed((): Group[] => {
    if (search.value) {
        return props.items.reduce((acc: Group[], item) => {
            const innerItems: Item[] = item.items.filter(
                item => item.name.search(search.value) >= 0
            );

            if (innerItems.length) {
                acc.push({
                    ...item,
                    items: innerItems
                });
            }

            return acc;
        }, []);
    } else {
        return props.items;
    }
});

const selectedItem = computed(() => {
    if (props.selected) {
        return props.selected;
    } else {
        return props.items[0]?.items[0]?.item;
    }
});

const selectedDescription = computed(() => {
    return description.value || props.items[0]?.items[0]?.description;
});

const select = (item: EventRef) => {
    emit("select", item);
};

const onSearch = (payload: string) => {
    search.value = payload;
};

const onHover = (item: Item) => {
    description.value = item?.description || "";
};
</script>
