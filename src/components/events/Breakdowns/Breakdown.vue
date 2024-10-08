<template>
  <div
    class="pf-l-flex"
    @mouseenter="showControls = true"
    @mouseleave="showControls = false"
  >
    <CommonIdentifier
      class="pf-l-flex__item"
      :index="index"
    />
    <div class="pf-c-action-list">
      <div class="pf-c-action-list__item">
        <template v-if="isBreakdownCohort(breakdown)">
          <CohortSelect
            :selected="breakdownCohort.cohortId"
            @select="changeCohort"
          >
            <button
              v-if="breakdownCohort.cohortId"
              class="pf-c-button pf-m-secondary"
              type="button"
            >
              {{ breakdownName() }}
            </button>
            <button
              v-else
              class="pf-c-button pf-m-primary"
              type="button"
            >
              <span class="pf-c-button__icon pf-m-start">
                <i
                  class="fas fa-plus-circle"
                  aria-hidden="true"
                />
              </span>
              Select cohort
            </button>
          </CohortSelect>
        </template>
        <template v-else>
          <BreakdownSelect
            :selected="breakdown"
            @select="changeBreakdown"
          >
            <button
              class="pf-c-button pf-m-secondary"
              type="button"
            >
              {{ breakdownName() }}
            </button>
          </BreakdownSelect>
        </template>
      </div>
      <div class="pf-c-action-list__item">
        {{ breakdownCaption() }}
      </div>
      <div
        v-show="showControls"
        class="pf-c-action-list__item"
      >
        <button
          class="pf-c-button pf-m-plain"
          type="button"
          aria-label="Remove"
          @click="removeBreakdown"
        >
          <i
            class="fas fa-times"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import BreakdownSelect from './BreakdownSelect.vue';
import CohortSelect from './CohortSelect.vue';
import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue';

import { useLexiconStore } from '@/stores/lexicon';
import {
    isBreakdownCohort,
    isBreakdownEventCommonCustomProperty,
    isBreakdownEventCommonProperty,
    isBreakdownUserCustomProperty,
    isBreakdownUserProperty,
    newBreakdownCohort
} from '@/stores/reports/breakdowns';

import type {
    Breakdown,
    BreakdownCohort,
    BreakdownEventCommonCustomProperty,
    BreakdownEventCommonProperty,
    BreakdownUserProperty} from '@/stores/reports/breakdowns';

const props = defineProps<{
    breakdown: Breakdown;
    index: number;
}>();

const emit = defineEmits<{
    (e: 'remove-breakdown', index: number): void;
    (e: 'change-breakdown', index: number, breakdown: Breakdown): void;
}>();

const showControls = ref(false);

const lexiconStore = useLexiconStore();

const removeBreakdown = (): void => {
    emit('remove-breakdown', props.index);
};

const breakdownCohort = computed(
    (): BreakdownCohort =>
        isBreakdownCohort(props.breakdown) ? (props.breakdown as BreakdownCohort) : props.breakdown
);

const changeBreakdown = (breakdown: Breakdown): void => {
    emit('change-breakdown', props.index, breakdown);
};

const changeCohort = (id: number): void => {
    emit('change-breakdown', props.index, newBreakdownCohort(id));
};

const breakdownName = (): string => {
    if (isBreakdownCohort(props.breakdown)) {
        const b = props.breakdown as BreakdownCohort;
        if (b.cohortId) {
            return lexiconStore.findCohortById(b.cohortId).name;
        }
    }

    if (isBreakdownUserProperty(props.breakdown)) {
        return lexiconStore.findGroupProperty(
            (props.breakdown as BreakdownUserProperty).propertyId
        )?.name || '';
    }

    if (isBreakdownEventCommonProperty(props.breakdown)) {
        return lexiconStore.findEventPropertyById(
            (props.breakdown as BreakdownEventCommonProperty).propertyId
        )?.name || '';
    }

    if (isBreakdownEventCommonCustomProperty(props.breakdown)) {
        return lexiconStore.findEventCustomPropertyById(
            (props.breakdown as BreakdownEventCommonCustomProperty).propertyId
        )?.name || '';
    }

    throw new Error('unhandled');
};

const breakdownCaption = (): string => {
    if (isBreakdownCohort(props.breakdown)) {
        return 'cohort';
    }
    if (isBreakdownUserProperty(props.breakdown)) {
        return 'user property';
    }
    if (isBreakdownUserCustomProperty(props.breakdown)) {
        return 'user custom property';
    }
    if (isBreakdownEventCommonProperty(props.breakdown)) {
        return 'event property';
    }
    if (isBreakdownEventCommonCustomProperty(props.breakdown)) {
        return 'event custom property';
    }
    throw new Error('unhandled');
};

</script>
