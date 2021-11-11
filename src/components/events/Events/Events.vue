<template>
  <div class="pf-l-flex pf-m-column">
    <SelectedEvent
        v-for="(event,index) in events"
        :event-ref="event.ref"
        :filters="event.filters"
        :index="index"
        @changeEvent="changeEvent"
        @removeEvent="removeEvent"
        @addFilter="addFilter"
        @removeFilter="removeFilter"
        @changeFilterProperty="changeFilterProperty"
        @changeFilterOperation="changeFilterOperation"
        @addFilterValue="addFilterValue"
        @removeFilterValue="removeFilterValue"
    />
    <div class="pf-l-flex">
      <EventSelect @select="addEvent">
        <button class="pf-c-button pf-m-primary" type="button">
          <span class="pf-c-button__icon pf-m-start">
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
          </span>
          Add Event
        </button>
      </EventSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import {EventRef, OperationId, PropertyRef, Value} from '../../../types'
import {eventsStore as newEventsStore} from "../../../stores/eventSegmentation/events";
import EventSelect from "./EventSelect.vue";
import SelectedEvent from "./SelectedEvent.vue";

const eventsStore = newEventsStore();
const events = eventsStore.events;

const addEvent = (ref: EventRef) => {
  eventsStore.addEventByRef(ref);
}

const changeEvent = (index: number, ref: EventRef) => {
  eventsStore.changeEvent(index, ref);
}

const removeEvent = (idx: number): void => {
  eventsStore.deleteEvent(idx)
}

const addFilter = (idx: number): void => {
  eventsStore.addFilter(idx)
}

const removeFilter = (eventIdx: number, filterIdx: number): void => {
  eventsStore.removeFilter(eventIdx, filterIdx)
}

const changeFilterProperty = (eventIdx: number, filterIdx: number, propRef: PropertyRef) => {
  eventsStore.changeFilterProperty(eventIdx, filterIdx, propRef)
}

const changeFilterOperation = (eventIdx: number, filterIdx: number, opId: OperationId) => {
  eventsStore.changeFilterOperation(eventIdx, filterIdx, opId)
}

const addFilterValue = (eventIdx: number, filterIdx: number, value: Value) => {
  eventsStore.addFilterValue(eventIdx, filterIdx, value)
}

const removeFilterValue = (eventIdx: number, filterIdx: number, value: Value) => {
  eventsStore.removeFilterValue(eventIdx, filterIdx, value)
}
</script>