<template>
  <div class="pf-l-flex pf-m-column">
    <div class="pf-l-flex">
      <div class="pf-l-flex__item">1.</div>
      <button class="pf-c-button pf-m-secondary" type="button">Secondary</button>
    </div>
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
import {lexiconStore} from '../../stores/lexicon'
import Popper from "vue3-popper";
import {Event, CustomEvent, EventType, EventRef} from '../../types'
import {computed, defineComponent, provide, reactive, ref} from "vue";
import {eventSegmentationStore} from "../../stores/eventSegmentation";
import EventItem from "./Event.vue";
import EventSelect from "./EventSelect.vue";


const lexicon = lexiconStore();
const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;
const eventToAdd = ref<SelectedEvent | null>(null);

const popular: PopularEvent[] = [];

type SelectedEvent = {
  type: EventType;
  id: number;
}

type PopularEvent = {
  type: EventType;
  id: number;
  event: Event;
}

const addEvent = (ref: EventRef) => {
  switch (ref.type) {
    case EventType.Regular:
      eventSegmentation.addEvent(ref.id);
      break
    case EventType.Custom:
      eventSegmentation.addCustomEvent(ref.id);
      break
  }
};

const handleDeleteEvent = (idx: number): void => {
  eventSegmentation.deleteEvent(idx)
}
</script>