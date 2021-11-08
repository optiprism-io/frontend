<template>
  <div class="pf-l-flex pf-m-column" @mouseenter="showControls=true" @mouseleave="showControls=false">
    <div class="pf-l-flex">
      <div class="pf-l-flex__item selected-list-item__identifier">{{ identifier }}.</div>
      <div class="pf-c-action-list">
        <div class="pf-c-action-list__item">
          <EventSelect @select="changeEvent" :selected="eventRef">
            <button class="pf-c-button pf-m-secondary" type="button">{{ eventName(eventRef) }}</button>
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
    <Filter
        v-for="(filter,index) in filters"
        :event-ref="eventRef"
        :filter="filter"
        :index="index"
        @removeFilter="removeFilter"
        @changeFilterProperty="changeFilterProperty"
        @changeFilterOperation="changeFilterOperation"
        @addFilterValue="addFilterValue"
        @removeFilterValue="removeFilterValue"
    />
  </div>
</template>

<script setup lang="ts">
import {EventFilter} from "../../../stores/eventSegmentation/events";
import EventSelect from './EventSelect.vue';
import {EventRef, EventType, OperationId, PropertyRef, Value} from "../../../types";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";
import Filter from "./Filter.vue";


const props = defineProps<{
  eventRef: EventRef;
  filters: EventFilter[]
  index: number;
}>()

const emit = defineEmits<{
  (e: 'changeEvent', index: number, ref: EventRef): void
  (e: 'removeEvent', index: number): void
  (e: 'addFilter', index: number): void
  (e: 'removeFilter', eventIdx: number, filterIdx: number): void
  (e: 'changeFilterProperty', eventIdx: number, filterIdx: number, propRef: PropertyRef): void
  (e: 'changeFilterOperation', eventIdx: number, filterIdx: number, opId: OperationId): void
  (e: 'addFilterValue', eventIdx: number, filterIdx: number, value: Value): void
  (e: 'removeFilterValue', eventIdx: number, filterIdx: number, value: Value): void
}>()

let showControls = ref(false);

const lexicon = lexiconStore();

const changeEvent = (ref: EventRef): void => {
  emit('changeEvent', props.index, ref)
}

const removeEvent = (): void => {
  emit('removeEvent', props.index);
}

const removeFilter = (filterIdx: number): void => {
  emit('removeFilter', props.index, filterIdx);
}

const addFilter = (): void => {
  emit('addFilter', props.index);
}

const changeFilterProperty = (filterIdx: number, propRef: PropertyRef): void => {
  emit('changeFilterProperty', props.index, filterIdx, propRef);
}

const changeFilterOperation = (filterIdx: number, opId: OperationId): void => {
  emit('changeFilterOperation', props.index, filterIdx, opId);
}

const addFilterValue = (filterIdx: number, value: Value): void => {
  emit('addFilterValue', props.index, filterIdx, value);
}

const removeFilterValue = (filterIdx: number, value: Value): void => {
  emit('removeFilterValue', props.index, filterIdx, value);
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