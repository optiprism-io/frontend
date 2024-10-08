<template>
  <Select
    :items="items"
    :grouped="true"
    :selected="selectedItem"
    @select="select"
  >
    <slot />
  </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Select from '@/components/Select/Select.vue';

import { useEventsStore } from '@/stores/eventSegmentation/events';
import { useLexiconStore } from '@/stores/lexicon';
import {
  newBreakdownCohort,
  newBreakdownEventCommonProperty,
  newBreakdownUserCustomProperty,
  newBreakdownUserProperty
} from '@/stores/reports/breakdowns'

import type { Property } from '@/api'
import type { Group, Item } from '@/components/Select/SelectTypes';
import type {
  Breakdown,
  BreakdownUserProperty,
  BreakdownUserCustomProperty,
  BreakdownCohort,
  BreakdownEventCommonProperty
} from '@/stores/reports/breakdowns';
import type { UserCustomProperty } from '@/types/events'

const props = defineProps<{
    selected?: Breakdown;
}>();

const emit = defineEmits<{
    (e: 'select', type: Breakdown): void;
}>();

const lexiconStore = useLexiconStore();
const eventStore = useEventsStore();
const events = eventStore.events;

const items = computed(() => {
    const ret: Group<Item<BreakdownCohort | BreakdownUserProperty | BreakdownUserCustomProperty | BreakdownEventCommonProperty, null>[]>[] = [];
    {
        const items: Item<BreakdownCohort, null>[] = [];
        items.push({ item: newBreakdownCohort(), name: 'Cohort' });
        ret.push({ name: '', items: items });
    }

    if (lexiconStore.groupProperties.flat().length > 0) {
        const items: Item<BreakdownUserProperty, null>[] = [];
        lexiconStore.groupProperties.flat().forEach((prop: Property): void => {
            items.push({
                item: newBreakdownUserProperty(prop.id),
                name: prop.name
            });
        });
        ret.push({ name: 'User Properties', items: items });
    }

    if (lexiconStore.userCustomProperties.length > 0) {
        const items: Item<BreakdownUserCustomProperty, null>[] = [];
        lexiconStore.userCustomProperties.forEach((prop: UserCustomProperty): void => {
            items.push({
                item: newBreakdownUserCustomProperty(prop.id),
                name: prop.name
            });
        });
        ret.push({ name: 'User Custom Properties', items: items });
    }

    if (events.length > 0) {
        const firstProps = lexiconStore.findEventProperties(events[0].ref);
        const firstCustomProps = lexiconStore.findEventCustomProperties(events[0].ref);
        if (firstProps.length > 0) {
            for (let i = 1; i < events.length; i++) {
                const props = lexiconStore.findEventProperties(events[i].ref);
                const rem: number[] = [];
                for (let j = 0; j < firstProps.length; j++) {
                    const firstProp = firstProps[j];
                    let found = false;
                    for (const curProp of props) {
                        if (
                            firstProp.name === curProp.name &&
                            firstProp.isArray === curProp.isArray &&
                            firstProp.isDictionary === curProp.isDictionary
                        ) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        rem.push(j);
                    }
                }

                rem.forEach(idx => firstProps.splice(idx, 1));
            }

            if (firstCustomProps.length > 0) {
                for (let i = 1; i < events.length; i++) {
                    const props = lexiconStore.findEventCustomProperties(events[i].ref);
                    const rem: number[] = [];
                    for (let j = 0; j < firstCustomProps.length; j++) {
                        const firstProp = firstCustomProps[j];
                        let found = false;
                        for (const curProp of props) {
                            if (
                                firstProp.name === curProp.name &&
                                firstProp.isArray === curProp.isArray
                            ) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            rem.push(j);
                        }
                    }

                    rem.forEach(idx => firstCustomProps.splice(idx, 1));
                }
            }
        }

        if (firstProps.length > 0) {
            const items: Item<BreakdownEventCommonProperty, null>[] = [];
            firstProps.forEach(prop =>
                items.push({
                    item: newBreakdownEventCommonProperty(prop.id),
                    name: prop.name
                })
            );

            ret.push({ name: 'Event Properties', items: items });
        }

        if (firstCustomProps.length > 0) {
            const items: Item<BreakdownEventCommonProperty, null>[] = [];
            firstCustomProps.forEach(prop => {
                if (prop.id) {
                    items.push({
                        item: newBreakdownEventCommonProperty(prop.id),
                        name: prop.name || ''
                    })
                }
            })

            ret.push({
                name: 'Event Custom Properties',
                items: items
            });
        }
    }

    return ret;
});

const selectedItem = computed(() => {
    if (props.selected) {
        return props.selected;
    } else {
        return items?.value[0]?.items[0]?.item;
    }
});

const select = (type: Breakdown) => {
    emit('select', type);
};
</script>
