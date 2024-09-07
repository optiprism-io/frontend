<template>
  <Select
    :items="items"
    :selected="selectedItem"
    :width-auto="true"
    :container="props.popperContainer || 'body'"
    @select="select"
  >
    <slot />
  </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Select from '@/components/Select/Select.vue'

import { DataType, PropertyType } from '@/api'
import { useLexiconStore } from '@/stores/lexicon'
import { findOperations } from '@/types'

import type { Item } from '@/components/Select/SelectTypes'
import type { OperationId } from '@/types'
import type { PropertyRef } from '@/types/events'

const props = defineProps<{
  propertyRef?: PropertyRef
  opItems?: Item<OperationId, null>[]
  selected?: OperationId
  popperContainer?: string
}>()

const emit = defineEmits<{
  (e: 'select', opId: OperationId): void
}>()

const lexiconStore = useLexiconStore()

const items = computed(() => {
  let ret: Item<OperationId, null>[] = []

  if (props.propertyRef) {
    if (props.propertyRef.type === PropertyType.Event) {
      const prop = lexiconStore.findEventProperty(props.propertyRef)
      if (prop) {
        findOperations(prop.dataType || DataType.String, prop.nullable, prop.isArray).forEach(op =>
          ret.push({
            item: op.id,
            name: op.name,
          })
        )
      }
    } else if (props.propertyRef.type === PropertyType.Custom) {
      const prop = lexiconStore.findEventCustomProperty(props.propertyRef.name)
      if (prop) {
        findOperations(
          prop?.type || DataType.String,
          prop.nullable || false,
          prop.isArray || false
        ).forEach(op =>
          ret.push({
            item: op.id,
            name: op.name,
          })
        )
      }
    } else if (props.propertyRef.type === PropertyType.Group) {
      const prop = lexiconStore.findGroupProperty(props.propertyRef.name)
      if (prop) {
        findOperations(prop.dataType || 'string', prop.nullable, prop.isArray).forEach(op =>
          ret.push({
            item: op.id,
            name: op.name,
          })
        )
      }
    }
  } else if (props.opItems && props.opItems.length) {
    ret = props.opItems
  }

  return ret
})

const selectedItem = computed((): OperationId | undefined => {
  if (props.selected) {
    return props.selected
  } else {
    return items?.value[0]?.item
  }
})

const select = (opId: OperationId) => {
  emit('select', opId)
}
</script>
