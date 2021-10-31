<template>
  <div class="pf-l-flex pf-m-column">
    <SelectedListItem
        v-for="(event,index) in events"
        :event-ref="event.ref"
        :filters="event.filters"
        :index="index"
        @changeEvent="changeEvent"
        @removeEvent="removeEvent"
        @addFilter="addFilter"
        @removeFilter="removeFilter"
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
import {EventRef} from '../../../types'
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import EventSelect from "./EventSelect.vue";
import SelectedListItem from "./SelectedListItem.vue";

const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;


const addEvent = (ref: EventRef) => {
  console.log(ref.type)
  eventSegmentation.addEventByRef(ref);
};

const changeEvent = (index: number, ref: EventRef) => {
  eventSegmentation.changeEvent(index, ref);
}

const removeEvent = (idx: number): void => {
  eventSegmentation.deleteEvent(idx)
}

const addFilter = (idx: number): void => {
  eventSegmentation.addFilter(idx)
}

const removeFilter = (idx: number): void => {
  eventSegmentation.removeFilter(idx)
}

</script>