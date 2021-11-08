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
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import Select, {Group, Item} from "../../Select/Select.vue";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";

const lexicon = lexiconStore();

const props = defineProps<{
  selected?: PropertyRef;
}>()

const emit = defineEmits<{
  (e: 'select', ref: PropertyRef): void
}>()


let items = computed((): Group[] => {
  let ret: Group[] = []
  if (lexicon.userProperties.length > 0) {
    let items: Item[] = [];
    lexicon.userProperties.forEach((prop: UserProperty): void => {
      items.push(<Item>{item: <PropertyRef>{type: PropertyType.User, id: prop.id}, name: prop.name});
    })
    ret.push(<Group>{name: "User Properties", items: items});
  }

  return ret;
})

// make default selection if nothing is initially selected
let selectedItem = ref<PropertyRef | undefined>(undefined);
if (props.selected) {
  selectedItem.value = props.selected
} else {
  selectedItem.value = items.value[0].items[0].item;
}

const select = (item: PropertyRef) => {
  emit('select', item)
};


</script>