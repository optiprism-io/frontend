<template>
  <div>e: {{ eventName }}
    <button @click="$emit('deleteEvent',props.idx)">delete</button>
  </div>
  events properties
  <select v-model="propToAdd">
    <option v-for="property in eventProperties" v-bind:value="{type:PropertyType.Event, id:property.id}">
      {{ property.name }}
    </option>
  </select>

  event custom properties
  <select v-model="propToAdd">
    <option v-for="property in eventCustomProperties" v-bind:value="{type:PropertyType.EventCustom, id:property.id}">
      {{ property.name }}
    </option>
  </select>
  user properties
  <select v-model="propToAdd">
    <option v-for="property in lexicon.userProperties" v-bind:value="{type:PropertyType.User, id:property.id}">
      {{ property.name }}
    </option>
  </select>

  user custom properties
  <select v-model="propToAdd">
    <option v-for="property in lexicon.userCustomProperties"
            v-bind:value="{type:PropertyType.UserCustom, id:property.id}">
      {{ property.name }}
    </option>
  </select>
  <div v-if="event.where.length>0">
    props
  </div>
</template>

<script setup lang="ts">
import {lexiconStore} from '../../stores/lexicon'

import {computed, ref} from "vue";
import {Event as ESEvent} from "../../stores/eventSegmentation";
import {EventCustomProperty, EventProperty, EventType, PropertyType} from "../../types"

const props = defineProps<{
  idx: number;
  event: ESEvent;
}>()

const emit = defineEmits<{
  (e: 'deleteEvent', idx: number): void
}>()

const lexicon = lexiconStore();
const propToAdd = ref<SelectedProperty | null>(null);


type SelectedProperty = {
  type: PropertyType;
  id: number;
}


const eventName = computed((): string => {
  if (props.event.type === EventType.Regular) {
    return lexicon.findEventById(props.event.id).name;
  } else if (props.event.type === EventType.Custom) {
    return lexicon.findCustomEventById(props.event.id).name;
  }

  throw new Error("unexpected");
})

const eventProperties = computed((): EventProperty[] => {
  if (props.event.type == EventType.Regular) {
    return lexicon.filterEventProperties(props.event.id);
  } else {
    throw new Error("unimplemented");
  }
})

const eventCustomProperties = computed((): EventCustomProperty[] => {
  if (props.event.type == EventType.Regular) {
    return lexicon.filterEventCustomProperties(props.event.id);
  } else {
    throw new Error("unimplemented");
  }
})
</script>

<style scoped>

</style>