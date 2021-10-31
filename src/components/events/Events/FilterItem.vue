<template>
  <div class="pf-l-flex" @mouseenter="showControls=true" @mouseleave="showControls=false">
    <div class="pf-c-action-list">
      <div class="pf-c-action-list__item filter__caption">with</div>
      <div class="pf-c-action-list__item">
        <PropertySelect @select="selectProperty" :event-ref="eventRef" v-if="filter.ref">
          <button class="pf-c-button pf-m-secondary" type="button">
            {{ propertyName(filter.ref) }}
          </button>
        </PropertySelect>
        <PropertySelect @select="selectProperty" :event-ref="eventRef" v-else>
          <button class="pf-c-button pf-m-primary" type="button">
                        <span class="pf-c-button__icon pf-m-start">
    <i class="fas fa-plus-circle" aria-hidden="true"></i>
  </span>

            Select property

          </button>
        </PropertySelect>
      </div>
      <div class="pf-c-action-list__item" v-show="showControls">
        <button class="pf-c-button pf-m-plain" type="button" aria-label="Remove" @click="removeFilter">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {EventFilter, eventSegmentationStore, FilterStep} from "../../../stores/eventSegmentation";
import {lexiconStore} from "../../../stores/lexicon";
import PropertySelect from "../PropertySelect/PropertySelect.vue";
import {EventRef, EventType, PropertyRef, PropertyType} from "../../../types";
import {onMounted, onUpdated, ref} from "vue";

const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;
const props = defineProps<{
  eventRef: EventRef;
  filter: EventFilter;
  index: number;
}>()

let showControls = ref(false);

const emit = defineEmits<{
  (e: 'removeFilter', index: number): void
}>()
const lexicon = lexiconStore();

const removeFilter = (): void => {
  emit('removeFilter', props.index);
}

const propertyName = (ref: PropertyRef): string => {
  switch (ref.type) {
    case PropertyType.Event:
      return lexicon.findPropertyById(ref.id).name;
    case EventType.Custom:
      return lexicon.findCustomEventById(ref.id).name;
  }
  throw new Error("unhandled");
};

const selectProperty = (ref: PropertyRef): void => {

}
</script>

<style scoped>
.filter__caption {
  margin-left: 56px;
}
</style>