<template>
  <div
    class="selected-event pf-l-flex pf-m-column pf-u-mb-md"
    :class="{
      'selected-event_preview': props.forPreview,
      'selected-event_active': dropdownStatesControl,
    }"
  >
    <div class="pf-l-flex">
      <CommonIdentifier class="pf-l-flex__item" :index="index" :type="props.identifier" />
      <div class="pf-c-action-list">
        <div class="pf-c-action-list__item">
          <Select
            grouped
            :items="eventItems"
            :selected="eventRef"
            :popper-container="props.popperContainer"
            :auto-hide="props.autoHide"
            @on-hover="onHoverEvent"
            @select="changeEvent"
            @action="emit('action', $event)"
            @edit="emit('edit', $event)"
          >
            <UiButton
              :class="[props.forPreview ? 'pf-m-control pf-m-small' : 'pf-m-secondary']"
              :disabled="props.forPreview"
            >
              {{ getEventName(eventRef) }}
            </UiButton>
            <template v-if="hoveredCustomEventId" #description>
              <SelectedEvent
                v-for="(eventItem, i) in hoveredCustomEventDescription"
                :key="i"
                :event="eventItem"
                :event-ref="eventItem.ref"
                :filters="eventItem.filters"
                :index="i"
                :show-breakdowns="false"
                :show-query="false"
                :for-preview="true"
              />
            </template>
          </Select>
        </div>
        <Select
          v-if="props.showQuery"
          class="pf-c-action-list__item"
          :items="lexiconStore.eventsQueries"
          @select="addQuery"
          @show="show"
          @hide="hide"
        >
          <div class="selected-event__control">
            <VTooltip popper-class="ui-hint">
              <UiIcon icon="fas fa-search" />
              <template #popper>
                {{ $t('common.addQuery') }}
              </template>
            </VTooltip>
          </div>
        </Select>
        <PropertySelect
          v-if="isShowAddFilter"
          class="pf-c-action-list__item"
          :is-open-mount="false"
          :event-ref="eventRef"
          :update-open="false"
          :popper-container="props.popperContainer"
          @select="addFilter"
          @show="show"
          @hide="hide"
        >
          <div class="selected-event__control">
            <VTooltip popper-class="ui-hint">
              <UiIcon icon="fas fa-filter" />
              <template #popper>
                {{ $t('common.addFilter') }}
              </template>
            </VTooltip>
          </div>
        </PropertySelect>
        <PropertySelect
          v-if="props.showBreakdowns"
          class="pf-c-action-list__item"
          :event-ref="eventRef"
          :disabled-items="breakdowns"
          @select="addBreakdown"
          @show="show"
          @hide="hide"
        >
          <div class="selected-event__control">
            <VTooltip popper-class="ui-hint">
              <UiIcon icon="fas fa-layer-group" />
              <template #popper>
                {{ $t('common.addBreakdown') }}
              </template>
            </VTooltip>
          </div>
        </PropertySelect>
        <div class="pf-c-action-list__item selected-event__control" @click="removeEvent">
          <VTooltip popper-class="ui-hint">
            <UiIcon icon="fas fa-times" />
            <template #popper>
              {{ $t('common.removeEvent') }}
            </template>
          </VTooltip>
        </div>
      </div>
    </div>
    <div v-if="showRows" class="selected-event__rows pf-l-flex pf-m-column">
      <Filter
        v-for="(filter, i) in filters"
        :key="i"
        :event-ref="eventRef"
        :filter="filter"
        :index="i"
        :update-open="updateOpenFilter"
        :popper-container="props.popperContainer"
        :popper-class="popperClass"
        :for-preview="props.forPreview"
        @on-click-value="updateValue"
        @remove-filter="removeFilter"
        @change-filter-property="changeFilterProperty"
        @change-filter-operation="changeFilterOperation"
        @add-filter-value="addFilterValue"
        @remove-filter-value="removeFilterValue"
        @handle-select-property="handleSelectProperty"
      />
      <template v-if="props.showBreakdowns">
        <Breakdown
          v-for="(breakdown, i) in breakdowns"
          :key="i"
          :event-ref="eventRef"
          :breakdown="breakdown"
          :selected-items="breakdowns"
          :index="i"
          :update-open="updateOpenBreakdown"
          @remove-breakdown="removeBreakdown"
          @change-breakdown-property="changeBreakdownProperty"
        />
      </template>
      <template v-if="props.showQuery">
        <Query
          v-for="(query, i) in queries"
          :key="i"
          :event-ref="eventRef"
          :item="query"
          :index="i"
          :update-open="updateOpenQuery"
          :no-delete="query.noDelete"
          @remove-query="removeQuery"
          @change-query="changeQuery"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EventRef, PropertyRef, EventQueryRef } from '@/types/events'
import { OperationId, Value } from '@/types'
import { useLexiconStore } from '@/stores/lexicon'
import {
  EventBreakdown,
  EventFilter,
  EventQuery,
  Event,
  initialQuery,
  EventPayload,
} from '@/stores/eventSegmentation/events'
import Select from '@/components/Select/Select.vue'
import Filter from '@/components/events/Filter.vue'
import Breakdown from '@/components/events/Breakdown.vue'
import Query from '@/components/events/Events/Query.vue'
import { Group, Item } from '@/components/Select/SelectTypes'
import schemaService from '@/api/services/schema.service'
import useCustomEvent from '@/components/events/Events/CustomEventHooks'
import { useEventName } from '@/helpers/useEventName'
import { EventType } from '@/api'
import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue'
import PropertySelect from '@/components/events/PropertySelect.vue'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useProjectsStore } from '@/stores/projects/projects'

const projectsStore = useProjectsStore()
const eventsStore = useEventsStore()

type Props = {
  eventRef: EventRef
  event: Event
  filters: EventFilter[]
  breakdowns?: EventBreakdown[]
  eventItems?: Group<Item<EventRef, null>[]>[]
  index: number
  queries?: EventQuery[]
  showBreakdowns?: boolean
  showQuery?: boolean
  popperContainer?: string
  popperClass?: string
  autoHide?: boolean
  forPreview?: boolean
  identifier?: 'numeric' | 'alphabet'
}

const props = withDefaults(defineProps<Props>(), {
  eventItems: () => [],
  showBreakdowns: true,
  showQuery: true,
  autoHide: true,
  identifier: 'alphabet',
})

const emit = defineEmits<{
  (e: 'changeEvent', index: number, ref: EventRef): void
  (e: 'removeEvent', index: number): void
  (e: 'handleSelectProperty'): void
  (e: 'addBreakdown', index: number): void
  (e: 'changeBreakdownProperty', eventIdx: number, breakdownIdx: number, propRef: PropertyRef): void
  (e: 'removeBreakdown', eventIdx: number, breakdownIdx: number): void
  (e: 'removeQuery', eventIdx: number, queryInx: number): void
  (e: 'addQuery', index: number): void
  (e: 'changeQuery', eventIdx: number, queryIdx: number, queryRef: EventQueryRef): void

  (e: 'setEvent', payload: EventPayload): void
  (e: 'action', payload: string): void
  (e: 'edit', payload: number): void
  (e: 'on-change'): void
}>()

const { hoveredCustomEventDescription, hoveredCustomEventId, onHoverEvent } = useCustomEvent()
const lexiconStore = useLexiconStore()

const updateOpenBreakdown = ref(false)
const updateOpenFilter = ref(false)
const updateOpenQuery = ref(false)
const dropdownStatesControl = ref(false)

const showRows = computed(() => {
  return props.filters.length || props.showBreakdowns || props.showQuery
})

const isShowAddFilter = computed(() => {
  return (
    lexiconStore?.eventProperties?.length ||
    lexiconStore?.userProperties?.length ||
    lexiconStore?.userCustomProperties?.length
  )
})

const setEvent = (payload: Event) => {
  emit('setEvent', {
    index: props.index,
    event: payload,
  })
}

const handleSelectProperty = (): void => {
  emit('handleSelectProperty')
}

const changeEvent = (ref: EventRef): void => {
  setEvent({
    ref: ref,
    filters: [],
    breakdowns: [],
    queries: initialQuery,
  })
}

const removeEvent = (): void => {
  emit('removeEvent', props.index)
}

const removeFilter = (filterIdx: number): void => {
  const event = props.event
  event.filters.splice(filterIdx, 1)
  emit('on-change')
}

const getPropertyValues = async (propRef: PropertyRef) => {
  let valuesList: Value[] = []

  try {
    const res = await schemaService.propertyValues(projectsStore.projectId, {
      eventName: props.event.ref.name,
      eventType: props.event.ref.type as EventType,
      propertyName: propRef.name,
      propertyType: propRef.type,
    })

    if (res?.data?.data) {
      valuesList = res.data.data
    }
  } catch (_) {
    throw new Error('error getPropertyValues')
  }

  return valuesList
}

const addFilter = (propRef: PropertyRef): void => {
  const event = props.event
  const emptyFilter = event.filters.find((filter): boolean => filter.propRef === undefined)
  const filterIdx = event.filters?.length || 0

  if (emptyFilter) {
    return
  }

  changeFilterProperty(filterIdx, propRef, false)
}

const show = () => {
  dropdownStatesControl.value = true
}

const hide = () => {
  dropdownStatesControl.value = false
}

const changeFilterProperty = async (filterIdx: number, propRef: PropertyRef, onChange = true) => {
  const event = props.event

  event.filters[filterIdx] = {
    propRef: propRef,
    opId: OperationId.Eq,
    values: [],
    valuesList: [],
  }

  if (onChange) {
    emit('on-change')
  }
}

const updateValue = async (filterIdx: number) => {
  const event = props.event
  const filter = event.filters[filterIdx]
  if (filter?.propRef) {
    filter.valuesList = (await getPropertyValues(filter.propRef)) || []
    event.filters[filterIdx] = filter
  }
}

const changeFilterOperation = (filterIdx: number, opId: OperationId) => {
  const event = props.event
  event.filters[filterIdx].opId = opId
  event.filters[filterIdx].values = []

  if (opId === OperationId.Empty || opId === OperationId.Exists) {
    emit('on-change')
  }
}

const addFilterValue = (filterIdx: number, value: Value): void => {
  const event = props.event
  event.filters[filterIdx].values.push(value)
  emit('on-change')
}

const removeFilterValue = (filterIdx: number, value: Value): void => {
  const event = props.event
  event.filters[filterIdx].values = props.event.filters[filterIdx].values.filter(v => v !== value)
  emit('on-change')
}

const addBreakdown = async (propRef: PropertyRef): Promise<void> => {
  const breakdownIdx = props.event?.breakdowns?.length
  changeBreakdownProperty(breakdownIdx, propRef)
}

const changeBreakdownProperty = (breakdownIdx: number, propRef: PropertyRef): void => {
  emit('changeBreakdownProperty', props.index, breakdownIdx, propRef)
}

const removeBreakdown = (breakdownIdx: number): void => {
  emit('removeBreakdown', props.index, breakdownIdx)
}

const getEventName = (ref: EventRef): string => {
  const eventName = useEventName()
  switch (ref.type) {
    case EventType.Regular:
      return ref.name || eventName(ref)
    case EventType.Custom:
      return ref.name
  }
}

const removeQuery = (idx: number): void => {
  emit('removeQuery', props.index, idx)
}

const addQuery = async (payload: EventQueryRef): Promise<void> => {
  const idx = eventsStore.events[props.index]?.queries?.length
  changeQuery(idx, payload)
}

const changeQuery = (idx: number, ref: EventQueryRef) => {
  emit('changeQuery', props.index, idx, ref)
}
</script>

<style scoped lang="scss">
.selected-event {
  color: var(--op-base-color-text);

  &_preview {
    pointer-events: none;
  }

  &__control {
    padding: 5px;
    opacity: 0;
    cursor: pointer;

    &:hover {
      color: var(--pf-global--palette--black-800);
    }
  }

  &_active,
  &:hover {
    .selected-event {
      &__control {
        opacity: 1;
      }
    }
  }
}
</style>
