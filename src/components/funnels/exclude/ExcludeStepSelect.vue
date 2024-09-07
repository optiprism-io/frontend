<template>
  <EventSelector @select="excludeEvent">
    <UiButton
      :is-link="true"
      before-icon="fas fa-plus"
    >
      {{ $t('funnels.excludeSteps.add') }}
    </UiButton>
  </EventSelector>
</template>

<script lang="ts" setup>
import EventSelector from '@/components/events/Events/EventSelector.vue';
import UiButton from '@/components/uikit/UiButton.vue'

import {useStepsStore} from '@/stores/funnels/steps';

import type {EventRef} from '@/types/events';

const stepsStore = useStepsStore()

const excludeEvent = (eventRef: EventRef): void => {
    stepsStore.addExcludedEvent({
        event: eventRef,
        steps: { type: 'all' }
    });
}
</script>
