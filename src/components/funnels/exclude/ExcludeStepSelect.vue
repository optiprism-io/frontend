<template>
  <EventSelector @select="excludeEvent">
    <UiButton
      :is-link="true"
      :before-icon="'fas fa-plus'"
    >
      {{ $t('funnels.excludeSteps.add') }}
    </UiButton>
  </EventSelector>
</template>

<script lang="ts" setup>
import EventSelector from '@/components/events/Events/EventSelector.vue';
import {EventRef} from '@/types/events';
import {useStepsStore} from '@/stores/funnels/steps';
import UiButton from '@/components/uikit/UiButton.vue'

const stepsStore = useStepsStore()

const excludeEvent = (eventRef: EventRef): void => {
    stepsStore.addExcludedEvent({
        event: eventRef,
        steps: { type: 'all' }
    });
}
</script>
