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
      <section class="pf-c-menu__group" v-if="eventProperties.length>0">
        <hr class="pf-c-divider"/>
        <h1 class="pf-c-menu__group-title">Event Properties</h1>
        <ul class="pf-c-menu__list">
          <PropertySelectListItem v-for="prop in eventProperties" :propRef="eventPropertyRef(prop)" :text="prop.name"
                                  :selected="selected"
                                  @hover="hoverProperty"
                                  @click="selectProperty"
          ></PropertySelectListItem>
        </ul>
      </section>

      <section class="pf-c-menu__group" v-if="eventCustomProperties.length>0">
        <hr class="pf-c-divider"/>
        <h1 class="pf-c-menu__group-title">Event Custom Properties</h1>
        <ul class="pf-c-menu__list">
          <PropertySelectListItem v-for="prop in eventCustomProperties" :propRef="eventCustomPropertyRef(prop)"
                                  :text="prop.name"
                                  :selected="selected"
                                  @hover="hoverProperty"
                                  @click="selectProperty"
          ></PropertySelectListItem>
        </ul>
      </section>

      <section class="pf-c-menu__group" v-if="userProperties.length>0">
        <hr class="pf-c-divider"/>
        <h1 class="pf-c-menu__group-title">User Properties</h1>
        <ul class="pf-c-menu__list">
          <PropertySelectListItem v-for="prop in userProperties" :propRef="userPropertyRef(prop)"
                                  :text="prop.name"
                                  :selected="selected"
                                  @hover="hoverProperty"
                                  @click="selectProperty"
          ></PropertySelectListItem>
        </ul>
      </section>

      <section class="pf-c-menu__group" v-if="userCustomProperties.length>0">
        <hr class="pf-c-divider"/>
        <h1 class="pf-c-menu__group-title">User Custom Properties</h1>
        <ul class="pf-c-menu__list">
          <PropertySelectListItem v-for="prop in userCustomProperties" :propRef="userCustomPropertyRef(prop)"
                                  :text="prop.name"
                                  :selected="selected"
                                  @hover="hoverProperty"
                                  @click="selectProperty"
          ></PropertySelectListItem>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {lexiconStore} from '../../../stores/lexicon'
import {
  EventCustomProperty,
  eventCustomPropertyRef,
  EventProperty,
  eventPropertyRef,
  EventRef,
  EventType,
  PropertyRef,
  userCustomPropertyRef,
  userPropertyRef
} from '../../../types'
import {ref} from "vue";
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import PropertySelectListItem from "./PropertySelectListItem.vue";

const lexicon = lexiconStore();
const eventSegmentation = eventSegmentationStore();
const props = defineProps<{
  eventRef: EventRef;
  selected?: PropertyRef;
}>()

const emit = defineEmits<{
  (e: 'select', ref: PropertyRef): void
  (e: 'hover', ref: PropertyRef): void
}>()


let eventProperties: EventProperty[] = []
let eventCustomProperties: EventCustomProperty[] = []

if (props.eventRef.type == EventType.Regular) {
  eventProperties = lexicon.findEventProperties(props.eventRef.id);
  eventCustomProperties = lexicon.findEventCustomProperties(props.eventRef.id);
}
const userProperties = lexicon.userProperties;
const userCustomProperties = lexicon.userCustomProperties;


let selected = ref(props.selected);

if (selected.value === undefined) {
  if (eventProperties.length > 0) {
    selected.value = eventPropertyRef(eventProperties[0]);
  } else if (eventCustomProperties.length > 0) {
    selected.value = eventCustomPropertyRef(eventCustomProperties[0])
  } else if (userProperties.length > 0) {
    selected.value = userPropertyRef(userProperties[0])
  } else if (userCustomProperties.length > 0) {
    selected.value = userPropertyRef(userCustomProperties[0])
  } else {
    throw new Error("unhandled");
  }
}

const hoverProperty = (ref: PropertyRef): void => {
  selected.value = ref;
  emit('hover', ref);
}

const selectProperty = (ref: PropertyRef): void => {
  emit('select', ref);
}

const propertyName = (ref: EventRef): string => {
  switch (ref.type) {
    case EventType.Regular:
      return lexicon.findEventById(ref.id).name;
    case EventType.Custom:
      return lexicon.findCustomEventById(ref.id).name;
  }
  throw new Error("unhandled");
};
</script>