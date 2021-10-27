<template>
  <div class="pf-c-menu pf-m-plain pf-m-scrollable">
    <div class="pf-c-menu__search">
      <div class="pf-c-menu__search-input">
        <input
            class="pf-c-form-control pf-m-search"
            type="search"
            id="-search-input"
            name="-search-input"
            aria-label="Search"
        />
      </div>
    </div>
    <div class="pf-c-menu__content">
      <section class="pf-c-menu__group" v-if="popularEvents.length>0">
        <h1 class="pf-c-menu__group-title">Popular</h1>
        <ul class="pf-c-menu__list">
          <EventSelectListItem v-for="ref in popularEvents" :eventRef="ref" :text="eventName(ref)"
                               :selected="selected"
                               @hover="onHoverEvent"
                               @click="onClickEvent"

          ></EventSelectListItem>
        </ul>
      </section>
      <section class="pf-c-menu__group" v-if="customEvents.length>0">
        <hr class="pf-c-divider"/>
        <h1 class="pf-c-menu__group-title">Custom</h1>
        <ul class="pf-c-menu__list">
          <EventSelectListItem v-for="event in customEvents" :eventRef="customEventRef(event)" :text="event.name"
                               :selected="selected"
                               @hover="onHoverEvent"
                               @click="onClickEvent"
          ></EventSelectListItem>
        </ul>
      </section>

      <section class="pf-c-menu__group" v-for="tag in eventsByTag">
        <hr class="pf-c-divider"/>

        <h1 class="pf-c-menu__group-title">{{ tag.tag }}</h1>
        <ul class="pf-c-menu__list">
          <EventSelectListItem v-for="event in tag.events" :eventRef="eventRef(event)" :text="event.name"
                               :selected="selected"
                               @hover="onHoverEvent"
                               @click="onClickEvent"
          ></EventSelectListItem>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {lexiconStore} from '../../../stores/lexicon'
import {CustomEvent, Event, EventRef, EventType, eventRef, customEventRef} from '../../../types'
import {computed, ref} from "vue";
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import EventSelectListItem from "./EventSelectListItem.vue";

const lexicon = lexiconStore();
const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;

const props = defineProps<{
  selected?: EventRef;
}>()

const emit = defineEmits<{
  (e: 'select', ref: EventRef): void
  (e: 'hover', ref: EventRef): void
}>()

const popular: EventRef[] = [];

const popularEvents = computed((): EventRef[] => {
  return []
});

const customEvents = computed((): CustomEvent[] => {
  return lexicon.customEvents;
});

type EventsByTag = {
  tag: string;
  events: Event[];
}
const eventsByTag = computed((): EventsByTag[] => {
  let ret: EventsByTag[] = [];

  lexicon.events.forEach((e: Event) => {
    e.tags.forEach((tag: string) => {
      let dst = ret.find((ge: EventsByTag) => ge.tag == tag)
      if (!dst) {
        ret.push({tag: tag, events: [e]});
      } else {
        dst.events.push(e);
      }
    });
  });

  return ret;
});

let selected = ref(props.selected);

if (selected.value === undefined) {
  if (popular.length > 0) {
    selected.value = popular[0];
  } else if (lexicon.customEvents.length > 0) {
    selected.value = <EventRef>{id: lexicon.customEvents[0].id, type: EventType.Custom}
  } else if (eventsByTag.value.length > 0 && eventsByTag.value[0].events.length > 0) {
    selected.value = <EventRef>{id: eventsByTag.value[0].events[0].id, type: EventType.Custom}
  } else {
    throw new Error("unhandled");
  }
}

const onHoverEvent = (ref: EventRef): void => {
  selected.value = ref;
  emit('hover', ref);
}

const onClickEvent = (ref: EventRef): void => {
  emit('select', ref);
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
</script>