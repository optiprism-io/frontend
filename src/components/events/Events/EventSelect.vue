<template>
  <Select @select="select" :items="items" grouped :selected="selectedItem">
    <slot></slot>
  </Select>
</template>

<script setup lang="ts">
import {CustomEvent, Event, EventRef, customEventRef, eventRef} from '../../../types'
import Select, {Group, Item} from "../../Select/Select.vue";
import {lexiconStore} from "../../../stores/lexicon";
import {computed, ref} from "vue";

const lexicon = lexiconStore();

const props = defineProps<{
  selected?: EventRef;
}>()

const emit = defineEmits<{
  (e: 'select', ref: EventRef): void
}>()

const items = computed((): Group[] => {
  let ret: Group[] = []

  if (lexicon.customEvents.length > 0) {
    let items: Item[] = [];
    lexicon.customEvents.forEach((e: CustomEvent) => {
      items.push(<Item>{item: customEventRef(e), name: e.name})
    })
    ret.push(<Group>{name: "Custom Events", items: items})
  }

  lexicon.events.forEach((e: Event) => {
    e.tags.forEach((tag: string) => {
      let dst = ret.find((g: Group) => g.name == tag)
      let item = <Item>{item: eventRef(e), name: e.name}
      if (!dst) {
        ret.push(<Group>{name: tag, items: [item]});
      } else {
        dst.items.push(item);
      }
    });
  });

  return ret;
})

// make default selection if nothing is initially selected
let selectedItem = ref<EventRef | undefined>(undefined);
if (props.selected) {
  selectedItem.value = props.selected
} else {
  selectedItem.value = items.value[0].items[0].item;
}

const select = (item: EventRef) => {
  emit('select', item)
};


</script>