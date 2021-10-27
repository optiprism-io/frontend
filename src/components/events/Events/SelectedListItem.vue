<template>
  <div class="pf-l-flex pf-m-column" @mouseenter="showControls=true" @mouseleave="showControls=false">
    <div class="pf-l-flex">
      <div class="pf-l-flex__item selected-list-item__identifier">{{ identifier }}.</div>
      <div class="pf-c-action-list">
        <div class="pf-c-action-list__item">
          <EventSelect @select="changeEvent" :selected="event.ref">
            <button class="pf-c-button pf-m-secondary" type="button">{{ eventName(event.ref) }}</button>
          </EventSelect>
        </div>
        <div class="pf-c-action-list__item" v-show="showControls">
          <button class="pf-c-button pf-m-plain" type="button" aria-label="Filter" @click="addFilter">
            <i class="fas fa-filter" aria-hidden="true"></i>
          </button>
        </div>
        <div class="pf-c-action-list__item" v-show="showControls">
          <button class="pf-c-button pf-m-plain" type="button" aria-label="Remove" @click="removeEvent">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <FilterItem v-for="(filter,index) in event.filters" :filter="filter" :index="index" @remove-filter="removeFilter"/>
  </div>
</template>

<script setup lang="ts">
import {eventSegmentationStore, Event} from "../../../stores/eventSegmentation";
import EventSelect from '../EventSelect/EventSelect.vue';
import {EventRef, EventType} from "../../../types";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";
import FilterItem from "./FilterItem.vue";

const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;

const props = defineProps<{
  event: Event;
  index: number;
}>()

const emit = defineEmits<{
  (e: 'changeEvent', index: number, ref: EventRef): void
  (e: 'removeEvent', index: number): void
  (e: 'addFilter', index: number): void
  (e: 'removeFilter', index: number): void
}>()

let showControls = ref(false);

const lexicon = lexiconStore();

const changeEvent = (ref: EventRef): void => {
  emit('changeEvent', props.index, ref)
}

const removeEvent = (): void => {
  emit('removeEvent', props.index);
}

const removeFilter = (): void => {
  emit('removeFilter', props.index);
}

const addFilter = (): void => {
  emit('addFilter', props.index);
}

const eventName = (ref: EventRef): string => {
  switch (ref.type) {
    case EventType.Regular:
      return lexicon.findEventById(ref.id).name;
    case EventType.Custom:
      return lexicon.findCustomEventById(ref.id).name;
  }
  throw new Error("unhandled");
};

const identifier = computed((): number => props.index + 1)
</script>

<style scoped>
.selected-list-item__identifier {
  width: 20px;
}
</style>