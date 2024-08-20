<template>
  <div class="pf-l-flex pf-m-column">
    <template
      v-for="(event, i) in step.events"
      :key="event.event.id"
    >
      <div class="pf-l-flex pf-u-align-items-center pf-m-nowrap">
        <CommonIdentifier
          class="pf-l-flex__item"
          type="numeric"
          :index="index"
        />
        <UiActionList>
          <template #main>
            <EventSelector @select="value => editStepEvent(i, value)">
              <UiButton class="pf-m-secondary">
                {{ eventName(event.event) }}
              </UiButton>
            </EventSelector>
          </template>

          <UiActionListItem v-if="false">
            <VTooltip class="ui-hint">
              <EventSelector @select="value => addStepToEvent(index, value)">
                <UiIcon icon="fas fa-plus" />
              </EventSelector>
              <template #popper>
                {{ $t('funnels.steps.addEvent') }}
              </template>
            </VTooltip>
          </UiActionListItem>

          <UiActionListItem v-if="isShowAddFilter">
            <PropertySelect @select="(propRef) => addProperty(propRef, i)">
              <VTooltip class="ui-hint">
                <UiIcon icon="fas fa-filter" />
                <template #popper>
                  {{ $t('funnels.steps.addFilter') }}
                </template>
              </VTooltip>
            </PropertySelect>
          </UiActionListItem>

          <UiActionListItem>
            <VTooltip class="ui-hint">
              <UiIcon
                icon="fas fa-times"
                @click="deleteEventFromStep(i)"
              />
              <template #popper>
                {{ $t('funnels.steps.removeEvent') }}
              </template>
            </VTooltip>
          </UiActionListItem>
        </UiActionList>
      </div>
      <Filter
        v-for="(filter, idx) in event.filters"
        :key="idx"
        :filter="filter"
        :event-ref="event.event"
        :index="idx"
        @remove-filter="removeFilterForStepEvent(i, idx)"
        @change-filter-property="(...args) => changeFilterPropertyForStepEvent(i, ...args)"
        @change-filter-operation="(...args) => changeFilterOperationForEvent(i, ...args)"
        @add-filter-value="(...args) => addFilterValueForStepEvent(i, ...args)"
        @remove-filter-value="(...args) => removeFilterValueForStepEvent(i, ...args)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { watch, computed } from 'vue';
import type { PropType} from 'vue';

import { Tooltip as VTooltip } from 'floating-vue'

import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue';
import EventSelector from '@/components/events/Events/EventSelector.vue';
import Filter from '@/components/events/Filter.vue';
import PropertySelect from '@/components/events/PropertySelect.vue';
import UiActionList from '@/components/uikit/UiActionList/UiActionList.vue';
import UiActionListItem from '@/components/uikit/UiActionList/UiActionListItem.vue';
import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

import { useEventName } from '@/helpers/useEventName';
import { useFilter } from '@/hooks/useFilter';
import { useStepsStore } from '@/stores/funnels/steps';
import { useLexiconStore } from '@/stores/lexicon';
import { OperationId } from '@/types';

import type { Value} from '@/types';
import type {EventRef, PropertyRef} from '@/types/events';
import type {Step} from '@/types/steps';

const stepsStore = useStepsStore();
const lexiconStore = useLexiconStore();
const eventName = useEventName();
const { getValues } = useFilter();

const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    step: {
        type: Object as PropType<Step>,
        required: true,
    }
})

const isShowAddFilter = computed(() => {
    return lexiconStore.propertiesLength;
});

const addStepToEvent = (index: number, event: EventRef): void => {
    stepsStore.addEventToStep({index, event})
}

const editStepEvent = (eventIndex: number, eventRef: EventRef): void => {
    stepsStore.editStepEvent({
        index: props.index,
        eventIndex,
        eventRef,
    });
}

const deleteEventFromStep = (eventIndex: number): void => {
    stepsStore.deleteEventFromStep({
        index: props.index,
        eventIndex
    });
}

const addProperty = async (payload: PropertyRef, eventIndex: number) => {
  stepsStore.addFilterToStep({
    index: props.index,
    eventIndex,
    filter: {
      propRef: payload,
      opId: OperationId.Eq,
      values: [],
      valuesList: await getValues(payload),
    },
  })
}

const removeFilterForStepEvent = (eventIndex: number, filterIndex: number): void => {
    stepsStore.removeFilterForStepEvent({
        index: props.index,
        eventIndex,
        filterIndex,
    })
}

const changeFilterPropertyForStepEvent = async (eventIndex: number, filterIndex: number, payload: PropertyRef): Promise<void> => {
    stepsStore.editFilterForStepEvent({
        index: props.index,
        eventIndex,
        filterIndex,
        filter: {
            propRef: payload,
            valuesList: await getValues(payload)
        }
    })
}

const addFilterValueForStepEvent = (eventIndex: number, filterIndex: number, payload: Value): void => {
    stepsStore.editFilterForStepEvent({
        index: props.index,
        eventIndex,
        filterIndex,
        filter: {
            values: [
                ...props.step.events[eventIndex].filters[filterIndex].values,
                payload
            ]
        }
    })
}

const changeFilterOperationForEvent = (eventIndex: number, filterIndex: number, payload: OperationId): void => {
    stepsStore.editFilterForStepEvent({
        index: props.index,
        eventIndex,
        filterIndex,
        filter: {
            opId: payload
        }
    })
}

const removeFilterValueForStepEvent = (eventIndex: number, filterIndex: number, value: Value): void => {
    stepsStore.editFilterForStepEvent({
        index: props.index,
        eventIndex,
        filterIndex,
        filter: {
            values: props.step.events[eventIndex]
                .filters[filterIndex]
                .values.filter(item => item !== value)
        }
    })
}

watch(() => props.step.events.length, (value): void => {
    if (value === 0) {
        stepsStore.deleteStep(props.index);
    }
})
</script>
