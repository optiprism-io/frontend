<template>
  <Select @select="select" :items="items" :selected="selectedItem">
    <slot></slot>
  </Select>
</template>

<script setup lang="ts">
import Select, {Group, Item} from "../../Select/Select.vue";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";

const props = defineProps<{
  selected?: number;
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
}>()

const lexicon = lexiconStore();

let items = computed((): Item[] => {
  let ret: Item[] = []

  lexicon.cohorts.forEach((cohort) => ret.push(<Item>{item: cohort.id, name: cohort.name}));

  return ret;
})

// make default selection if nothing is initially selected
  let selectedItem = ref<number | undefined>(undefined);
  if (props.selected) {
    selectedItem.value = props.selected
  } else {
    selectedItem.value = items.value[0].item;
  }

  const select = (item: number) => {
    emit('select', item)
  };


</script>