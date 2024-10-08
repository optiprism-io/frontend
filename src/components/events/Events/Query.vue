<template>
  <div class="queries pf-l-flex pf-m-nowrap">
    <UiIcon icon="fas fa-search" />
    <div class="pf-c-action-list">
      <div class="pf-c-action-list__item">
        <Select
          v-if="item.queryRef"
          :items="lexiconStore.eventsQueries"
          :selected="item.queryRef"
          :width-auto="true"
          @select="changeQuery"
        >
          <UiButton class="pf-m-secondary">
            {{ querySelectorName }}
          </UiButton>
        </Select>
        <Select
          v-else
          :items="lexiconStore.eventsQueries"
          :update-open="updateOpen"
          @select="changeQuery"
        >
          <UiButton
            before-icon="fas fa-plus-circle"
            class="pf-m-primary"
            type="button"
          >
            {{ $t('events.selectQuery') }}
          </UiButton>
        </Select>
      </div>

      <PropertySelect
        v-if="showProperty"
        :event-ref="eventRef"
        :selected="propRef"
        :width-auto="true"
        :data-type="propertiesDataType"
        @select="changeProperty"
      >
        <UiButton
          :before-icon="!propRef ? 'fas fa-plus-circle' : ''"
          :class="{
            'pf-m-secondary': propRef,
            'pf-m-primary': !propRef,
          }"
        >
          {{ propertySelectButtonText }}
        </UiButton>
      </PropertySelect>
      <div v-if="showAggregateText" class="pf-c-action-list__item pf-u-text-align-right">
        {{ aggregateString }}
      </div>
      <div v-if="showOnlyAggregate" class="pf-c-action-list__item">
        <Select
          :items="lexiconStore.eventsQueryAggregates"
          :selected="selectedAggregateRef"
          :show-search="false"
          :width-auto="true"
          @select="changeQueryAggregate"
        >
          <UiButton
            :before-icon="!selectedAggregateRef ? 'fas fa-plus-circle' : ''"
            :class="{
              'pf-m-secondary': selectedAggregateRef,
              'pf-m-primary': !selectedAggregateRef,
            }"
          >
            {{ selectAggregateName }}
          </UiButton>
        </Select>
      </div>
      <div v-if="showGroupAggregate" class="pf-c-action-list__item">
        <Select
          :items="lexiconStore.eventsQueryAggregates"
          :selected="selectedGroupAggregateRef"
          :show-search="false"
          :width-auto="true"
          @select="changeQueryGroupAggregate"
        >
          <UiButton
            :before-icon="!selectedGroupAggregateRef ? 'fas fa-plus-circle' : ''"
            :class="{
              'pf-m-secondary': selectedGroupAggregateRef,
              'pf-m-primary': !selectedGroupAggregateRef,
            }"
          >
            {{ selectedGroupAggregateName }}
          </UiButton>
        </Select>
      </div>
      <div v-if="queryInfo?.hasValue" class="pf-c-action-list__item">
        <UiInput :value="queryValue" @input="changeFormula" />
      </div>
      <div
        v-if="!noDelete"
        class="pf-c-action-list__item queries__control-item"
        @click="removeQuery"
      >
        <VTooltip popper-class="ui-hint">
          <UiIcon icon="fas fa-times" />
          <template #popper>
            {{ $t('events.query.removeQuery') }}
          </template>
        </VTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Tooltip as VTooltip } from 'floating-vue'
import { useI18n } from 'vue-i18n'

import PropertySelect from '@/components/events/PropertySelect.vue'
import Select from '@/components/Select/Select.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiInput from '@/components/uikit/UiInput.vue'

import {
  DataType,
} from '@/api'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'

import type { Item } from '@/components/Select/SelectTypes'
import type { EventQuery } from '@/stores/eventSegmentation/events'
import type { Events } from '@/stores/eventSegmentation/events';
import type { AggregateRef } from '@/types/aggregate'
import type { EventRef, EventQueryRef, EventsQuery, PropertyRef } from '@/types/events'

const props = defineProps<{
  eventRef: EventRef
  item: EventQuery
  index: number
  updateOpen?: boolean
  noDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove-query', index: number): void
  (e: 'change-query', queryIdx: number, queryRef: EventQueryRef): void
}>()

const eventsStore: Events = useEventsStore()
const lexiconStore = useLexiconStore()
const { t } = useI18n()

const queryInfo = computed((): EventsQuery | undefined => {
  return lexiconStore.findQuery(props.item.queryRef)
})

const propertiesDataType = computed(() => {
  const queryType = queryInfo.value?.type
  return queryType === 'aggregateProperty' || queryType === 'aggregatePropertyPerGroup' ? DataType.Decimal : undefined
})

const propRef = computed((): PropertyRef | undefined => {
  return props?.item?.queryRef?.propRef
})

const queryValue = computed(() => props.item.queryRef?.value || '')

const showProperty = computed(() => queryInfo.value?.hasProperty)

const property = computed(() => {
  return props.item?.queryRef?.propRef ? lexiconStore.property(props.item?.queryRef?.propRef) : null
})

const propertyName = computed((): string => property.value?.name || '')

const propertySelectButtonText = computed(() => {
  return (
    propertyName.value ||
    props.item?.queryRef?.propRef?.name ||
    props.item?.queryRef?.propRef?.id ||
    t('events.selectProperty')
  )
})

const showOnlyAggregate = computed(() => {
  return queryInfo.value?.hasAggregate && !queryInfo.value?.hasProperty
})

const showGroupAggregate = computed(() => {
  return queryInfo.value?.hasGroupAggregate
})

const showAggregateText = computed(() => {
  return showGroupAggregate.value || showOnlyAggregate.value
})

const selectedAggregate = computed((): Item<EventQueryRef, null> | undefined => {
  return props.item?.queryRef?.typeAggregate
    ? lexiconStore.eventsQueryAggregates.find(
        item => props.item?.queryRef?.typeAggregate === item.item.typeAggregate
      )
    : undefined
})

const selectAggregateName = computed((): string => {
  return selectedAggregate.value?.name || t('events.selectAggregate')
})

const selectedAggregateRef = computed((): AggregateRef | undefined => {
  return (selectedAggregate.value?.item as AggregateRef) || undefined
})

const selectedGroupAggregate = computed((): Item<EventQueryRef, null> | undefined => {
  return props.item?.queryRef?.typeGroupAggregate
    ? lexiconStore.eventsQueryAggregates.find(
        item => props.item?.queryRef?.typeGroupAggregate === item.item.typeAggregate
      )
    : undefined
})

const selectedGroupAggregateRef = computed((): AggregateRef | undefined => {
  return (selectedGroupAggregate.value?.item as AggregateRef) || undefined
})

const selectedGroupAggregateName = computed((): string => {
  return selectedGroupAggregate.value?.name || t('events.selectAggregate')
})

const querySelectorName = computed((): string => {
  return showProperty.value && props.item.queryRef
    ? `${selectAggregateName.value} of property`
    : queryInfo.value?.displayName || ''
})

const aggregateString = computed((): string => {
  const id = eventsStore.group
  const group = lexiconStore.groups.find(item => item.id === id)

  return t('events.perGroupAggregateBy', {
    group: group?.name || '',
  })
})

const changeQueryAggregate = (payload: AggregateRef) => {
  if (props.item.queryRef) {
    emit('change-query', props.index, {
      ...props.item.queryRef,
      ...payload,
    })
  }
}

const changeQueryGroupAggregate = (payload: AggregateRef) => {
  if (props.item.queryRef) {
    emit('change-query', props.index, {
      ...props.item.queryRef,
      typeGroupAggregate: payload.typeAggregate,
    })
  }
}

const changeQuery = (payload: EventQueryRef) => {
  emit('change-query', props.index, payload)
}

const removeQuery = () => {
  emit('remove-query', props.index)
}

const changeProperty = (payload: PropertyRef) => {
  if (props.item.queryRef) {
    emit('change-query', props.index, {
      ...props.item.queryRef,
      propRef: payload,
    })
  }
}

const changeFormula = (value: string) => {
  if (props.item.queryRef) {
    emit('change-query', props.index, {
      ...props.item.queryRef,
      value,
    })
  }
}
</script>

<style scoped lang="scss">
.queries {
  .pf-c-action-list {
    flex-wrap: wrap;
    gap: 0.5rem;

    & > * + * {
      margin-left: 0;
    }
  }

  &:hover {
    .queries__control-item {
      opacity: 1;
    }
  }

  &__control-item {
    opacity: 0;
    cursor: pointer;
  }
}
</style>
