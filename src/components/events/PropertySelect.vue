<template>
  <Select
    grouped
    :is-open-mount="isOpenMount"
    :items="items"
    :selected="selected"
    :update-open="updateOpen"
    :width-auto="true"
    :disabled="disabled"
    :placement="placement"
    :popper-class="props.popperClass"
    :popper-container="props.popperContainer"
    @select="select"
    @hide="emit('hide')"
    @show="emit('show')"
  >
    <slot />
  </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EventRef, PropertyRef } from '@/types/events';
import Select from '@/components/Select/Select.vue';
import { Group, Item } from '@/components/Select/SelectTypes';
import { useLexiconStore } from '@/stores/lexicon';
import { PropertyType, Property, DataType } from '@/api';
import usei18n from '@/hooks/useI18n';

type PropertyItem = Item<PropertyRef, null>

const { t } = usei18n();
const lexiconStore = useLexiconStore();

const emit = defineEmits<{
    (e: 'select', ref: PropertyRef): void;
    (e: 'hide'): void;
    (e: 'show'): void;
}>();

const props = defineProps<{
    dataType?: string
    eventRef?: EventRef;
    eventRefs?: EventRef[];
    selected?: PropertyRef;
    isOpenMount?: boolean;
    updateOpen?: boolean;
    disabledItems?: any[];
    forceProps?: Property[];
    placement?: string;
    popperContainer?: string;
    popperClass?: string;
}>();

const checkDisable = (propRef: PropertyRef): boolean => {
    return props.disabledItems ? Boolean(props.disabledItems.find((item) => JSON.stringify(item.propRef) === JSON.stringify(propRef))) : false;
};

const noDataPropertyes = computed(() => {
    return !lexiconStore.propertiesLength;
});

const getProperties = (items: Property[], name: string, type: PropertyType) => {
    return {
        name,
        items: items.reduce((acc: PropertyItem[], item) => {
            if (
                item.hidden ||
                (
                    props.dataType === DataType.Decimal &&
                    item.dataType !== DataType.Decimal
                )
            ) {
                return acc;
            }

            const propertyRef: PropertyRef = {
                type: type,
                id: item.id,
                name: item.name
            };

            acc.push({
                item: propertyRef,
                name: item.name,
                disabled: checkDisable(propertyRef),
                description: item?.description
            });

            return acc;
        }, [])
    }
}

const items = computed(() => {
    const ret: Group<PropertyItem[]>[] = [];

    if (noDataPropertyes.value) {
        return [{
            name: '',
            items: [{
                item: {
                    type: PropertyType.Event,
                    id: 0,
                    name: '',
                },
                name: t('common.noProperties'),
                description: t('common.noPropertiesText'),
                editable: false,
                noSelected: true,
            }],
        }];
    }

    const systemProperties = getProperties(lexiconStore.systemProperties, t('events.systemProperties'), PropertyType.System)
    if (systemProperties.items.length) {
        ret.push(systemProperties);
    }

    const eventProperties = getProperties(lexiconStore.eventProperties, t('events.eventProperties'), PropertyType.Event)
    if (eventProperties.items.length) {
        ret.push(eventProperties);
    }

    const userProperties = getProperties(lexiconStore.userProperties, t('events.userProperties'), PropertyType.User)
    if (userProperties.items.length) {
        ret.push(userProperties);
    }

    return ret;
});

const disabled = computed(() => {
    return !lexiconStore.propertiesLength;
});

const select = (item: PropertyRef) => {
    emit('select', item);
};
</script>
