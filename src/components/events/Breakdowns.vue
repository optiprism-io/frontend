<template>
  <div class="pf-v5-l-flex pf-v5-m-column">
    <Breakdown
      v-for="(breakdown, i) in breakdowns"
      :key="i"
      :breakdown="breakdown"
      :selected-items="breakdowns"
      :index="i"
      :event-refs="eventRefs"
      :has-icon="false"
      @remove-breakdown="removeBreakdown"
      @change-breakdown-property="changeBreakdownProperty"
    />
    <div class="pf-v5-l-flex">
      <PropertySelect
        :event-refs="eventRefs"
        :disabled-items="breakdowns"
        @select="addBreakdown"
      >
        <UiButton :is-link="true" :before-icon="'fas fa-plus'">
          {{ $t('events.addBreakdown') }}
        </UiButton>
      </PropertySelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Breakdown from '@/components/events/Breakdown.vue'
import PropertySelect from '@/components/events/PropertySelect.vue'
import UiButton from '@/components/uikit/UiButton.vue'

import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'

import type { PropertyRef } from '@/types/events'

const eventsStore = useEventsStore()
const breakdownsStore = useBreakdownsStore()

const emit = defineEmits<{
  (e: 'on-change'): void
}>()

const eventRefs = computed(() => eventsStore.events.map(item => item.ref))
const breakdowns = computed(() => breakdownsStore.breakdowns)

const onChange = () => {
  emit('on-change')
}

const changeBreakdownProperty = (breakdownIdx: number, propRef: PropertyRef) => {
  breakdownsStore.changeBreakdownProperty(breakdownIdx, propRef)
  onChange()
}

const addBreakdown = (propRef: PropertyRef): void => {
  breakdownsStore.addBreakdown(propRef)
  onChange()
}

const removeBreakdown = (idx: number): void => {
  breakdownsStore.removeBreakdown(idx)
  onChange()
}
</script>
