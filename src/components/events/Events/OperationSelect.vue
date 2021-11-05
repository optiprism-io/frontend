<template>
  <Select @select="select" :items="items" :selected="selectedItem">
    <slot></slot>
  </Select>
</template>

<script setup lang="ts">
import {
  findOperations, OperationId,
  PropertyRef,
  PropertyType
} from '../../../types'
import {eventSegmentationStore} from "../../../stores/eventSegmentation";
import Select, {Group, Item} from "../../Select/Select.vue";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";

const eventSegmentation = eventSegmentationStore();
const events = eventSegmentation.events;
const lexicon = lexiconStore();

const props = defineProps<{
  propertyRef: PropertyRef;
  selected?: OperationId;
}>()

const emit = defineEmits<{
  (e: 'select', opId: OperationId): void
}>()

const items = computed((): Item[] => {
  let ret: Item[] = []

  if (props.propertyRef.type === PropertyType.Event) {
    const prop = lexicon.findEventPropertyById(props.propertyRef.id)
    findOperations(prop.type, prop.nullable, prop.is_array).forEach((op) => ret.push(<Item>{
      item: op.id,
      name: op.name
    }))
  } else if (props.propertyRef.type === PropertyType.EventCustom) {
    const prop = lexicon.findEventCustomPropertyById(props.propertyRef.id)
    findOperations(prop.type, prop.nullable, prop.is_array).forEach((op) => ret.push(<Item>{
      item: op.id,
      name: op.name
    }))
  } else if (props.propertyRef.type === PropertyType.User) {
    const prop = lexicon.findUserPropertyById(props.propertyRef.id)
    findOperations(prop.type, prop.nullable, prop.is_array).forEach((op) => ret.push(<Item>{
      item: op.id,
      name: op.name
    }))
  } else if (props.propertyRef.type === PropertyType.UserCustom) {
    const prop = lexicon.findUserCustomPropertyById(props.propertyRef.id)
    findOperations(prop.type, prop.nullable, prop.isArray).forEach((op) => ret.push(<Item>{
      item: op.id,
      name: op.name
    }))
  }

  return ret;
})

// make default selection if nothing is initially selected
let selectedItem = ref<OperationId | undefined>(undefined);
if (props.selected) {
  selectedItem.value = props.selected
} else {
  selectedItem.value = items.value[0].item;
}

const select = (opId: OperationId) => {
  emit('select', opId)
};

</script>