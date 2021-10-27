<template>
  <div class="pf-l-flex" @mouseenter="showControls=true" @mouseleave="showControls=false">
    <div class="pf-c-action-list">
      <div class="pf-c-action-list__item filter__caption">with</div>
      <div class="pf-c-action-list__item">
        <EventSelect @select="addEvent" v-if="filter.ref">
          <button class="pf-c-button pf-m-secondary" type="button">
            Add Event
          </button>
        </EventSelect>
        <EventSelect @select="addEvent" v-else>
          <button class="pf-c-button pf-m-primary" type="button">
                        <span class="pf-c-button__icon pf-m-start">
    <i class="fas fa-plus-circle" aria-hidden="true"></i>
  </span>

            Select property

          </button>
        </EventSelect>
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
import EventSelect from "../EventSelect/EventSelect.vue";
import {EventRef} from "../../../types";
import {onMounted, onUpdated, ref} from "vue";

const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;
const props = defineProps<{
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
</script>

<style scoped>
.filter__caption {
  margin-left: 56px;
}
</style>