<template>
    <Select
        grouped
        :is-open-mount="isOpenMount"
        :items="items"
        :selected="selected"
        @select="select"
    >
        <slot />
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

    return ret;
});

const select = (item: PropertyRef) => {
    emit("select", item);
};
</script>
