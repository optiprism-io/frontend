<template>
  <div class="pf-v5-l-flex pf-v5-m-column">
    <SelectedEvent
      v-for="(event, index) in events"
      :key="index"
      :event="event"
      :event-ref="event.ref"
      :filters="event.filters"
      :index="index"
      :event-items="lexiconStore.eventsList"
      :breakdowns="event.breakdowns"
      :queries="event.queries"
      :auto-hide="!commonStore.showCreateCustomEvent"
      :identifier="identifier"
      @action="selectAction"
      @edit="editEvent"
      @set-event="setEvent"
      @remove-event="removeEvent"
      @add-breakdown="addBreakdown"
      @change-breakdown-property="changeBreakdownProperty"
      @remove-breakdown="removeBreakdown"
      @remove-query="removeQuery"
      @add-query="addQuery"
      @change-query="changeQuery"
      @on-change="onChange"
    />
    <div class="pf-v5-l-flex">
      <EventSelector @select="addEvent">
        <slot name="new" />
      </EventSelector>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue';

import EventSelector from '@/components/events/Events/EventSelector.vue'
import SelectedEvent from '@/components/events/Events/SelectedEvent.vue'

import {
  QueryAggregatePropertyPerGroupTypeEnum,
  QueryAggregatePropertyTypeEnum,
  QueryCountPerGroupTypeEnum,
  QueryFormulaTypeEnum,
  QuerySimpleTypeEnum,
} from '@/api'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'

import type { EventPayload} from '@/stores/eventSegmentation/events';
import type { EventQueryRef, EventRef, PropertyRef } from '@/types/events'

const props = defineProps({
  identifier: {
    type: String as PropType<'numeric' | 'alphabet'>,
    default: 'alphabet',
  },
  createWithQuery: {
    type: Boolean,
    default: true,
  },
})

const lexiconStore = useLexiconStore()
const eventsStore = useEventsStore()
const commonStore = useCommonStore()

const emit = defineEmits<{
  (e: 'on-change'): void
}>()

const events = computed(() => eventsStore.events)

const setEvent = (payload: EventPayload) => {
  eventsStore.setEvent(payload)
  onChange()
}

const addEvent = (ref: EventRef) => {
  eventsStore.addEventByRef(ref, props.createWithQuery)
  onChange()
}

const removeEvent = (idx: number): void => {
  eventsStore.deleteEvent(idx)
  onChange()
}

const addBreakdown = (idx: number): void => {
  eventsStore.addBreakdown(idx)
  onChange()
}

const changeBreakdownProperty = (eventIdx: number, breakdownIdx: number, propRef: PropertyRef) => {
  eventsStore.changeBreakdownProperty(eventIdx, breakdownIdx, propRef)
  onChange()
}

const removeBreakdown = (eventIdx: number, breakdownIdx: number): void => {
  eventsStore.removeBreakdown(eventIdx, breakdownIdx)
  onChange()
}

const addQuery = (idx: number): void => {
  eventsStore.addQuery(idx)
  onChange()
}

const removeQuery = (eventIdx: number, queryIdx: number): void => {
  eventsStore.removeQuery(eventIdx, queryIdx)
  onChange()
}

const changeQuery = (eventIdx: number, queryIdx: number, ref: EventQueryRef) => {
  eventsStore.changeQuery(eventIdx, queryIdx, ref)

  if (
    ((ref.type === QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup ||
      ref.type === QueryAggregatePropertyTypeEnum.AggregateProperty) &&
      ref.propRef) ||
    (ref.type === QueryCountPerGroupTypeEnum.CountPerGroup && ref.typeGroupAggregate) ||
    (ref.type === QueryFormulaTypeEnum.Formula && ref.value) ||
    (Object.values(QuerySimpleTypeEnum) as string[]).includes(ref.type as string)
  ) {
    onChange()
  }
}

const selectAction = (payload: string) => {
  if (payload === 'createCustomEvent') {
    eventsStore.setEditCustomEvent(null)
    commonStore.togglePopupCreateCustomEvent(true)
  }
}

const editEvent = (payload: number) => {
  eventsStore.setEditCustomEvent(Number(payload))
  commonStore.togglePopupCreateCustomEvent(true)
  onChange()
}

const onChange = () => {
  emit('on-change')
}
</script>
