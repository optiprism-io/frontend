<template>
  <Select @select="addEvent" :grouped-items="groupedEvents">
    <button class="pf-c-button pf-m-primary" type="button">
          <span class="pf-c-button__icon pf-m-start">
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
          </span>
      Add Event
    </button>
  </Select>
</template>

<script setup lang="ts">
import {CustomEvent, Event, EventRef, customEventRef, eventRef} from '../../../types'
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import Select, {Group, Item} from "../../Select/Select.vue";
import {computed} from "vue";
import {lexiconStore} from "../../../stores/lexicon";

const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;
const lexicon = lexiconStore();

const emit = defineEmits<{
  (e: 'select', ref: EventRef): void
}>()

let groupedEvents: Group[] = []

if (lexicon.customEvents.length > 0) {
  let items: Item[] = [];
  lexicon.customEvents.forEach((e: CustomEvent) => {
    items.push(<Item>{item: customEventRef(e), name: e.name})
  })
  groupedEvents.push(<Group>{name: "Custom Events", items: items})
}

lexicon.events.forEach((e: Event) => {
  e.tags.forEach((tag: string) => {
    let dst = groupedEvents.find((g: Group) => g.name == tag)
    let item = <Item>{item: eventRef(e), name: e.name}
    if (!dst) {
      groupedEvents.push(<Group>{name: tag, items: [item]});
    } else {
      dst.items.push(item);
    }
  });
});

const addEvent = (item: any) => {
  console.log(item as EventRef)
  emit('select', item as EventRef)
};


</script>