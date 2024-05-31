<template>
  <Select
    grouped
    :is-open-mount="isOpenMount"
    :items="items"
    :selected="selected"
    :update-open="updateOpen"
    :width-auto="true"
    :disabled="disabled"
    :placement="placement"
    :popper-class="props.popperClass"
    :popper-container="props.popperContainer"
    @select="select"
    @hide="emit('hide')"
    @show="emit('show')"
  >
    <slot />
  </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EventRef, PropertyRef } from '@/types/events'
import Select from '@/components/Select/Select.vue'
import { useLexiconStore } from '@/stores/lexicon'
import { Property, DataType } from '@/api'
import { useProperty, PropertyItem } from '@/hooks/useProperty'

const { groupedProperties } = useProperty()
const lexiconStore = useLexiconStore()

const emit = defineEmits<{
  (e: 'select', ref: PropertyRef): void
  (e: 'hide'): void
  (e: 'show'): void
}>()

const props = defineProps<{
  dataType?: string
  eventRef?: EventRef
  eventRefs?: EventRef[]
  selected?: PropertyRef
  isOpenMount?: boolean
  updateOpen?: boolean
  disabledItems?: any[]
  forceProps?: Property[]
  placement?: string
  popperContainer?: string
  popperClass?: string
}>()

const checkDisable = (propRef: PropertyRef): boolean => {
  return props.disabledItems
    ? Boolean(
        props.disabledItems.find(item => JSON.stringify(item.propRef) === JSON.stringify(propRef))
      )
    : false
}

const items = computed(() => {
  return groupedProperties.value.map(group => {
    return {
      name: group.name,
      items: group.items.reduce((acc: PropertyItem[], item) => {
        if (
          !item.hidden &&
          !(props.dataType === DataType.Decimal && item.dataType !== DataType.Decimal)
        ) {
          acc.push({
            ...item,
            disabled: checkDisable(item.item)
          })
        }
        return acc  
      }, [])
    }
  })
})

const disabled = computed(() => {
  return !lexiconStore.propertiesLength
})

const select = (item: PropertyRef) => {
  emit('select', item)
}
</script>
