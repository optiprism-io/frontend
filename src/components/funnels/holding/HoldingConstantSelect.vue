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
import PropertySelect from '@/components/events/PropertySelect.vue';
import UiButton from '@/components/uikit/UiButton.vue'

import { PropertyType } from '@/api';
import { useStepsStore } from '@/stores/funnels/steps';
import { useLexiconStore } from '@/stores/lexicon';

import type { EventFilterByPropertyTypeEnum} from '@/api';
import type {PropertyRef} from '@/types/events';

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
