<template>
  <div v-if="holdingProperties.length > 0" class="pf-v5-l-flex">
    <span class="pf-v5-l-flex__item">
      {{ $t('funnels.holdingConstant.holding') }}
    </span>
    <PropertySelect
      v-for="(props, index) in holdingProperties"
      :key="index"
      class="pf-v5-l-flex__item"
      :force-props="lexiconStore.eventProperties"
      @select="editHoldingProperty(index, $event)"
    >
      <UiButton class="pf-v5-m-secondary">
        {{ props.name }}
        <span class="pf-v5-c-button__icon pf-v5-m-end">
          <UiIcon icon="fas fa-times" @click.stop="deleteHoldingProperty(index)" />
        </span>
      </UiButton>
    </PropertySelect>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PropertySelect from '@/components/events/PropertySelect.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

import { EventFilterByPropertyTypeEnum, PropertyType } from '@/api'
import { useStepsStore } from '@/stores/funnels/steps'
import { useLexiconStore } from '@/stores/lexicon'

import type { PropertyRef } from '@/types/events'

const lexiconStore = useLexiconStore()
const stepsStore = useStepsStore()
const holdingProperties = computed(() => stepsStore.holdingProperties)

const editHoldingProperty = (index: number, propertyRef: PropertyRef) => {
  const property =
    propertyRef.type === PropertyType.Group
      ? lexiconStore.findGroupProperty(propertyRef.name)
      : propertyRef.type === PropertyType.Custom
        ? lexiconStore.findEventCustomProperty(propertyRef.name)
        : lexiconStore.findEventProperty(propertyRef)

  if (property?.id && property?.name) {
    stepsStore.editHoldingProperty({
      index,
      property: {
        id: property.id,
        name: property.name,
        type: EventFilterByPropertyTypeEnum.Property,
      },
    })
  }
}

const deleteHoldingProperty = (index: number): void => {
  stepsStore.deleteHoldingProperty(index)
}
</script>
