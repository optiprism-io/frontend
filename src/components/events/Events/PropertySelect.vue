<template>
    <Select :items="items" grouped :selected="selectedItem" @select="select">
        <slot></slot>
    </Select>
</template>

<script setup lang="ts">
import {
    Event,
    EventCustomProperty,
    EventProperty,
    EventRef,
    EventType,
    PropertyRef,
    PropertyType,
    UserCustomProperty,
    UserProperty
} from "../../../types";
import Select, { Group, Item } from "../../Select/Select.vue";
import { lexiconStore } from "../../../stores/lexicon";
import { computed } from "vue";

const lexicon = lexiconStore();

const props = defineProps<{
    eventRef: EventRef;
    selected?: PropertyRef;
}>();

const emit = defineEmits<{
    (e: "select", ref: PropertyRef): void;
}>();

let items = computed((): Group[] => {
    let ret: Group[] = [];
    if (props.eventRef.type == EventType.Regular) {
        let eventProperties = lexicon.findEventProperties(props.eventRef.id);
        if (eventProperties.length > 0) {
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

        let eventCustomProperties = lexicon.findEventCustomProperties(props.eventRef.id);
        if (eventCustomProperties.length > 0) {
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

    if (lexicon.userProperties.length > 0) {
        let items: Item[] = [];
        lexicon.userProperties.forEach((prop: UserProperty): void => {
            const propertyRef: PropertyRef = {
                type: PropertyType.User,
                id: prop.id
            };

            items.push({
                item: propertyRef,
                name: prop.name
            });
        });
        ret.push({ name: "User Properties", items: items });
    }

    if (lexicon.userCustomProperties.length > 0) {
        let items: Item[] = [];
        lexicon.userCustomProperties.forEach((prop: UserCustomProperty): void => {
            const propertyRef: PropertyRef = {
                type: PropertyType.UserCustom,
                id: prop.id
            };
            items.push({
                item: propertyRef,
                name: prop.name
            });
        });
        ret.push({ name: "User Custom Properties", items: items });
    }

    return ret;
});

let selectedItem = computed((): PropertyRef | undefined => {
    if (props.selected) {
        return props.selected;
    } else {
        return items?.value[0]?.items[0]?.item;
    }
});

const select = (item: PropertyRef) => {
    emit("select", item);
};
</script>
