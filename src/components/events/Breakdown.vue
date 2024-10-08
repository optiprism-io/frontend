<template>
  <div class="breakdown pf-l-flex">
    <UiIcon v-if="hasIcon" icon="fas fa-layer-group" />
    <div class="pf-c-action-list">
      <CommonIdentifier v-if="showIdentifier" :index="index" />
      <div class="pf-c-action-list__item">
        <PropertySelect
          v-if="breakdown.propRef"
          :event-ref="eventRef"
          :selected="breakdown.propRef"
          :disabled-items="selectedItems"
          @select="changeProperty"
        >
          <UiButton class="pf-m-secondary">
            {{ breakdown.propRef.name }}
          </UiButton>
        </PropertySelect>
        <PropertySelect
          v-else
          :is-open-mount="true"
          :event-ref="eventRef"
          :update-open="updateOpen"
          :disabled-items="selectedItems"
          @select="changeProperty"
        >
          <UiButton
            before-icon="fas fa-plus-circle"
            class="pf-m-primary"
            type="button"
            @click="handleSelectProperty"
          >
            {{ $t('events.selectBreakdown') }}
          </UiButton>
        </PropertySelect>
      </div>
      <div v-if="breakdown.error" class="pf-c-action-list__item">
        <VTooltip popper-class="ui-hint">
          <UiIcon class="pf-u-warning-color-100" icon="fas fa-exclamation-triangle" />
          <template #popper>
            {{ $t('events.errorBreakdown') }}
          </template>
        </VTooltip>
      </div>
      <div class="pf-c-action-list__item breakdown__control-item">
        <UiButton
          class="pf-m-plain"
          icon="fas fa-times"
          @click="removeBreakdown"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tooltip as VTooltip } from 'floating-vue'

import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue'
import PropertySelect from '@/components/events/PropertySelect.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

import type { EventBreakdown } from '@/stores/eventSegmentation/events'
import type { EventRef, PropertyRef } from '@/types/events'

interface IProps {
  eventRef?: EventRef
  eventRefs?: EventRef[]
  breakdown: EventBreakdown
  index: number
  updateOpen?: boolean
  selectedItems?: EventBreakdown[]
  showIdentifier?: boolean
  hasIcon?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  eventRef: undefined,
  eventRefs: undefined,
  selectedItems: undefined,
  updateOpen: false,
  showIdentifier: false,
  hasIcon: true,
})

const emit = defineEmits<{
  (e: 'remove-breakdown', index: number): void
  (e: 'change-breakdown-property', breakdownIdx: number, propRef: PropertyRef): void
  (e: 'handle-select-property'): void
}>()

const removeBreakdown = (): void => {
  emit('remove-breakdown', props.index)
}

const changeProperty = (propRef: PropertyRef): void => {
  emit('change-breakdown-property', props.index, propRef)
}

const handleSelectProperty = (): void => {
  emit('handle-select-property')
}
</script>

<style scoped lang="scss">
.breakdown {
  &:hover {
    .breakdown__control-item {
      opacity: 1;
    }
  }

  &__control-item {
    opacity: 0;
  }
}
</style>
