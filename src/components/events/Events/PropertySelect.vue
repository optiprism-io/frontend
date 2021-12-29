<template>
    <Select
        grouped
        :is-open-mount="isOpenMount"
        :items="items"
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
import {
    EventCustomProperty,
    EventProperty,
    EventRef,
    EventType,
    PropertyRef,
    PropertyType,
    UserCustomProperty,
    UserProperty
} from "../../../types";
import Select from "../../Select/Select.vue";
import { Group, Item } from "@/components/Select/SelectTypes";
import { useLexiconStore } from "@/stores/lexicon";
import { computed, ref } from "vue";

const lexiconStore = useLexiconStore();

const emit = defineEmits<{
    (e: "select", ref: PropertyRef): void;
}>();

const props = defineProps<{
    eventRef: EventRef;
    selected?: PropertyRef;
    isOpenMount?: boolean;
}>();

const search = ref("");
const description = ref();

const items = computed((): Group[] => {
    let ret: Group[] = [];

    if (lexiconStore.userProperties.length) {
        let items: Item[] = [];
        lexiconStore.userProperties.forEach((prop: UserProperty): void => {
            const propertyRef: PropertyRef = {
                type: PropertyType.User,
                id: prop.id
            };

            items.push({
                item: propertyRef,
                name: prop.name,
                description: prop?.description
            });
        });
        ret.push({ name: "User Properties", items: items });
    }

    if (lexiconStore.userCustomProperties.length) {
        let items: Item[] = [];
        lexiconStore.userCustomProperties.forEach((prop: UserCustomProperty): void => {
            const propertyRef: PropertyRef = {
                type: PropertyType.UserCustom,
                id: prop.id
            };
            items.push({
                item: propertyRef,
                name: prop.name,
                description: prop?.description
            });
        });
        ret.push({ name: "User Custom Properties", items: items });
    }

    if (props.eventRef.type == EventType.Regular) {
        const eventProperties = lexiconStore.findEventProperties(props.eventRef.id);

        if (eventProperties.length) {
            let items: Item[] = [];
            eventProperties.forEach((prop: EventProperty): void => {
                const propertyRef: PropertyRef = {
                    type: PropertyType.Event,
                    id: prop.id
                };

                items.push({
                    item: propertyRef,
                    name: prop.name
                });
            });
            ret.push({ name: "Event Properties", items: items });
        }

        const eventCustomProperties = lexiconStore.findEventCustomProperties(props.eventRef.id);

        if (eventCustomProperties.length) {
            let items: Item[] = [];

            eventCustomProperties.forEach((prop: EventCustomProperty): void => {
                const propertyRef: PropertyRef = {
                    type: PropertyType.EventCustom,
                    id: prop.id
                };

                items.push({
                    item: propertyRef,
                    name: prop.name
                });
            });
            ret.push({
                name: "Event Custom Properties",
                items: items
            });
        }
    }

    if (search.value) {
        return ret.reduce((acc: Group[], item) => {
            const innerItems: Item[] = item.items.filter(item => {
                const name = item.name.toLowerCase();

                return name.search(search.value) >= 0;
            });

            if (innerItems.length) {
                acc.push({
                    ...item,
                    items: innerItems
                });
            }

            return acc;
        }, []);
    } else {
        return ret;
    }
});

const selectedDescription = computed(() => {
    return description.value === undefined
        ? items.value[0]?.items[0]?.description
        : description.value;
});

const selectedItem = computed((): PropertyRef | undefined => {
    if (props.selected) {
        return props.selected;
    } else {
        return items?.value[0]?.items[0]?.item;
    }
});

const select = (item: PropertyRef) => {
    emit("select", item);
};

const onSearch = (payload: string) => {
    search.value = payload.toLowerCase();
};

const onHover = (item: Item) => {
    description.value = item?.description || "";
};
</script>
