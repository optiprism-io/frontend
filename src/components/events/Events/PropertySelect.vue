<template>
  <Select @select="select" :grouped-items="groupedProperties" :selected="selectedItem">
    <slot></slot>
  </Select>
</template>

<script setup lang="ts">
import {
  Event, EventCustomProperty,
  EventProperty,
  EventRef,
  EventType,
  PropertyRef,
  PropertyType, UserCustomProperty, UserProperty
} from '../../../types'
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import Select, {Group, Item} from "../../Select/Select.vue";
import {lexiconStore} from "../../../stores/lexicon";
import {ref} from "vue";

const lexicon = lexiconStore();

const props = defineProps<{
  eventRef: EventRef;
  selected?: PropertyRef;
}>()

const emit = defineEmits<{
  (e: 'select', ref: PropertyRef): void
}>()

let groupedProperties: Group[] = []

if (props.eventRef.type == EventType.Regular) {
  let eventProperties = lexicon.findEventProperties(props.eventRef.id);
  if (eventProperties.length > 0) {
    let items: Item[] = [];
    eventProperties.forEach((prop: EventProperty): void => {
      items.push(<Item>{item: <PropertyRef>{type: PropertyType.Event, id: prop.id}, name: prop.name});
    })
    groupedProperties.push(<Group>{name: "Event Properties", items: items});
  }

  let eventCustomProperties = lexicon.findEventCustomProperties(props.eventRef.id);
  if (eventCustomProperties.length > 0) {
    let items: Item[] = [];
    eventCustomProperties.forEach((prop: EventCustomProperty): void => {
      items.push(<Item>{item: <PropertyRef>{type: PropertyType.EventCustom, id: prop.id}, name: prop.name});
    })
    groupedProperties.push(<Group>{name: "Event Custom Properties", items: items});
  }
}

if (lexicon.userProperties.length > 0) {
  let items: Item[] = [];
  lexicon.userProperties.forEach((prop: UserProperty): void => {
    items.push(<Item>{item: <PropertyRef>{type: PropertyType.User, id: prop.id}, name: prop.name});
  })
  groupedProperties.push(<Group>{name: "User Properties", items: items});
}

if (lexicon.userCustomProperties.length > 0) {
  let items: Item[] = [];
  lexicon.userProperties.forEach((prop: UserCustomProperty): void => {
    items.push(<Item>{item: <PropertyRef>{type: PropertyType.UserCustom, id: prop.id}, name: prop.name});
  })
  groupedProperties.push(<Group>{name: "User Custom Properties", items: items});
}

// make default selection if nothing is initially selected
let selectedItem = ref<PropertyRef | undefined>(undefined);
if (props.selected) {
  selectedItem.value = props.selected
} else {
  selectedItem.value = groupedProperties[0].items[0].item;
}

const select = (item: PropertyRef) => {
  emit('select', item)
};


</script>