<template>
  <div v-if="holdingProperties.length > 0" class="pf-l-flex">
    <span class="pf-l-flex__item">
      {{ $t('funnels.holdingConstant.holding') }}
    </span>
    <PropertySelect
      v-for="(props, index) in holdingProperties"
      :key="index"
      class="pf-l-flex__item"
      :force-props="lexiconStore.eventProperties"
      @select="editHoldingProperty(index, $event)"
    >
      <UiButton class="pf-m-secondary">
        {{ props.name }}
        <span class="pf-c-button__icon pf-m-end">
          <UiIcon icon="fas fa-times" @click.stop="deleteHoldingProperty(index)" />
        </span>
      </UiButton>
    </PropertySelect>
  </div>
</template>

<script lang="ts" setup>
import { useStepsStore } from '@/stores/funnels/steps'
import { computed } from 'vue'
import { useLexiconStore } from '@/stores/lexicon'
import PropertySelect from '@/components/events/PropertySelect.vue'
import { PropertyRef } from '@/types/events'
import { EventFilterByPropertyTypeEnum, PropertyType } from '@/api'

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
