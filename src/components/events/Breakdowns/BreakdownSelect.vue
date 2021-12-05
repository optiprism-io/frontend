<template>
  <Select @select="select" :items="items" grouped :selected="selectedItem">
    <slot></slot>
  </Select>
</template>

<script setup lang="ts">
import Select, {Group, Item} from "../../Select/Select.vue";
import {computed, ref} from "vue";
import {
  Breakdown,
  BreakdownEventCommonProperty,
  BreakdownType, newBreakdownCohort,
  newBreakdownEventCommonCustomProperty,
  newBreakdownEventCommonProperty,
  newBreakdownUserCustomProperty,
  newBreakdownUserProperty,
} from "../../../stores/eventSegmentation/breakdowns";
import {
  newFilterCohort,
  newFilterUserCustomProperty,
  newFilterUserProperty
} from "../../../stores/eventSegmentation/filters";
import {
  EventCustomProperty,
  EventProperty, eventRef,
  EventRef,
  EventType,
  UserCustomProperty,
  UserProperty
} from "../../../types";
import {lexiconStore} from "../../../stores/lexicon";
import {eventsStore as newEventsStore} from "../../../stores/eventSegmentation/events";

const emit = defineEmits<{
  (e: 'select', type: Breakdown): void
}>()

const props = defineProps<{
  selected?: Breakdown;
}>()

const lexicon = lexiconStore();
const eventStore = newEventsStore();
const events = eventStore.events;

const items = computed((): Group[] => {
  let ret: Group[] = []
  {
    let items: Item[] = [];
    items.push(<Item>{item: newBreakdownCohort(), name: 'Cohort'});
    ret.push(<Group>{name: '', items: items});
  }

  if (lexicon.userProperties.length > 0) {
    let items: Item[] = [];
    lexicon.userProperties.forEach((prop: UserProperty): void => {
      items.push(<Item>{item: newBreakdownUserProperty(prop.id), name: prop.name});
    })
    ret.push(<Group>{name: "User Properties", items: items});
  }

  if (lexicon.userCustomProperties.length > 0) {
    let items: Item[] = [];
    lexicon.userCustomProperties.forEach((prop: UserCustomProperty): void => {
      items.push(<Item>{item: newBreakdownUserCustomProperty(prop.id), name: prop.name});
    })
    ret.push(<Group>{name: "User Custom Properties", items: items});
  }

  if (events.length > 0) {
    let firstProps = lexicon.findEventProperties(events[0].ref.id);
    let firstCustomProps = lexicon.findEventCustomProperties(events[0].ref.id);
    if (firstProps.length > 0) {
      for (let i = 1; i < events.length; i++) {
        let props = lexicon.findEventProperties(events[i].ref.id);
        let rem: number[] = [];
        for (let j = 0; j < firstProps.length; j++) {
          let firstProp = firstProps[j];
          let found = false;
          for (let curProp of props) {
            if (firstProp.name === curProp.name && firstProp.is_array === curProp.is_array && firstProp.is_dictionary === curProp.is_dictionary) {
              found = true;
              break
            }
          }
          if (!found) {
            rem.push(j);
          }
        }

        rem.forEach((idx) => firstProps.splice(idx, 1));
      }

      if (firstCustomProps.length > 0) {
        for (let i = 1; i < events.length; i++) {
          let props = lexicon.findEventCustomProperties(events[i].ref.id);
          let rem: number[] = [];
          for (let j = 0; j < firstCustomProps.length; j++) {
            let firstProp = firstCustomProps[j];
            let found = false;
            for (let curProp of props) {
              if (firstProp.name === curProp.name && firstProp.is_array === curProp.is_array && firstProp.is_dictionary === curProp.is_dictionary) {
                found = true;
                break
              }
            }
            if (!found) {
              rem.push(j);
            }
          }

          rem.forEach((idx) => firstCustomProps.splice(idx, 1));
        }
      }
    }

    if (firstProps.length > 0) {
      let items: Item[] = [];
      firstProps.forEach((prop) => items.push(<Item>{
        item: newBreakdownEventCommonProperty(prop.id),
        name: prop.name
      }));

      ret.push(<Group>{name: "Event Properties", items: items});
    }

    if (firstCustomProps.length > 0) {
      let items: Item[] = [];
      firstCustomProps.forEach((prop) => items.push(<Item>{
        item: newBreakdownEventCommonProperty(prop.id),
        name: prop.name
      }));

      ret.push(<Group>{name: "Event Custom Properties", items: items});
    }
  }


  return ret;
})

// make default selection if nothing is initially selected
let selectedItem = ref<Breakdown | undefined>(undefined);
if (props.selected) {
  selectedItem.value = props.selected
} else {
  selectedItem.value = items.value[0].items[0].item;
}


const select = (type: BreakdownType) => {
  emit('select', type)
};

</script>