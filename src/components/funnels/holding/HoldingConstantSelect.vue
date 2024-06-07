<template>
  <PropertySelect
    :force-props="lexiconStore.eventProperties"
    @select="addHoldingConstant"
  >
    <UiButton
      :is-link="true"
      :before-icon="'fas fa-plus'"
    >
      {{ $t('funnels.holdingConstant.add') }}
    </UiButton>
  </PropertySelect>
</template>

<script lang="ts" setup>
import {useLexiconStore} from '@/stores/lexicon';
import {useStepsStore} from '@/stores/funnels/steps';
import PropertySelect from '@/components/events/PropertySelect.vue';
import {PropertyRef} from '@/types/events';
import { EventFilterByPropertyTypeEnum, PropertyType } from '@/api';

const lexiconStore = useLexiconStore();
const stepsStore = useStepsStore();

const addHoldingConstant = (propertyRef: PropertyRef): void => {
    const property = propertyRef.type === PropertyType.Group
        ? lexiconStore.findGroupProperty(propertyRef.name)
        : propertyRef.type === PropertyType.Custom
            ? lexiconStore.findEventCustomProperty(propertyRef.name)
            : lexiconStore.findEventProperty(propertyRef);

    if (property?.id && property?.name) {
        stepsStore.addHoldingProperty({
            id: property.id,
            name: property.name,
            type: propertyRef.type as EventFilterByPropertyTypeEnum,
        });
    }
}
</script>
