<template>
  <div class="pf-l-flex pf-m-column">
    <SelectedEvent
        v-for="(event,index) in eventsEvents"
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
import {eventsStore} from "../../../stores/eventSegmentation/events";
import EventSelect from "./EventSelect.vue";
import SelectedEvent from "./SelectedEvent.vue";

const events = eventsStore();
const eventsEvents = events.events;

const addEvent = (ref: EventRef) => {
  events.addEventByRef(ref);
};

const changeEvent = (index: number, ref: EventRef) => {
  events.changeEvent(index, ref);
}

const removeEvent = (idx: number): void => {
  events.deleteEvent(idx)
}

const addFilter = (idx: number): void => {
  events.addFilter(idx)
}

const removeFilter = (eventIdx: number, filterIdx: number): void => {
  events.removeFilter(eventIdx, filterIdx)
}

const changeFilterProperty = (eventIdx: number, filterIdx: number, propRef: PropertyRef) => {
  events.changeFilterProperty(eventIdx, filterIdx, propRef)
}

const changeFilterOperation = (eventIdx: number, filterIdx: number, opId: OperationId) => {
  events.changeFilterOperation(eventIdx, filterIdx, opId)
}

const addFilterValue = (eventIdx: number, filterIdx: number, value: Value) => {
  events.addFilterValue(eventIdx, filterIdx, value)
}

const removeFilterValue = (eventIdx: number, filterIdx: number, value: Value) => {
  events.removeFilterValue(eventIdx, filterIdx, value)
}
</script>