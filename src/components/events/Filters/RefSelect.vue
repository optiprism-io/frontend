<template>
  <Select @select="select" :items="items" grouped :selected="selectedItem">
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
import Select, {Group, Item} from "../../Select/Select.vue";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";
import {
  FilterRefCohort,
  FilterRef,
  newFilterCohort, newFilterUserCustomProperty,
  newFilterUserProperty
} from "../../../stores/eventSegmentation/filters";

const lexicon = lexiconStore();

const props = defineProps<{
  selected?: FilterRef;
}>()

const emit = defineEmits<{
  (e: 'select', ref: FilterRef): void
}>()


let items = computed((): Group[] => {
  let ret: Group[] = []

  {
    let items: Item[] = [];
    items.push(<Item>{item: newFilterCohort(), name: 'Cohort'});
    ret.push(<Group>{name: '', items: items});
  }

  if (lexicon.userProperties.length > 0) {
    let items: Item[] = [];
    lexicon.userProperties.forEach((prop: UserProperty): void => {
      items.push(<Item>{item: newFilterUserProperty(prop.id), name: prop.name});
    })
    ret.push(<Group>{name: "User Properties", items: items});
  }

  if (lexicon.userCustomProperties.length > 0) {
    let items: Item[] = [];
    lexicon.userCustomProperties.forEach((prop: UserCustomProperty): void => {
      items.push(<Item>{item: newFilterUserCustomProperty(prop.id), name: prop.name});
    })
    ret.push(<Group>{name: "User Custom Properties", items: items});
  }

  return ret;
})

// make default selection if nothing is initially selected
let selectedItem = ref<FilterRef | undefined>(undefined);
if (props.selected) {
  selectedItem.value = props.selected
} else {
  selectedItem.value = items.value[0].items[0].item;
}

const select = (item: FilterRef) => {
  emit('select', item)
};


</script>