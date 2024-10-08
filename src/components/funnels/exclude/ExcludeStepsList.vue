<template>
  <div
    v-for="(item, index) in excludedEvents"
    :key="index"
    class="pf-l-flex pf-m-column"
  >
    <UiActionList>
      <template #main>
        <div class="pf-l-flex pf-m-nowrap row-gap">
          <span class="pf-l-flex__item">
            {{ $t('funnels.excludeSteps.exclude') }}
          </span>

          <EventSelector
            class="pf-l-flex__item"
            @select="editEvent($event, index)"
          >
            <UiButton
              class="pf-m-secondary"
              :is-link="true"
            >
              {{ eventName(item.event) }}
            </UiButton>
          </EventSelector>

          <span class="pf-l-flex__item">
            {{ $t('funnels.excludeSteps.between') }}
          </span>

          <UiSelect
            :items="excludeSteps"
            :show-search="false"
            @update:model-value="editEventSteps($event, index)"
          >
            <UiButton
              class="pf-m-secondary pf-l-flex__item"
              :is-link="true"
            >
              {{ excludeStepsToString(item.steps) }}
            </UiButton>
          </UiSelect>

          <span class="pf-l-flex__item">
            {{ $t('funnels.excludeSteps.steps') }}
          </span>
        </div>
      </template>

      <UiActionListItem>
        <PropertySelect @select="(propRef) => createFilterForEvent(propRef, index)">
          <VTooltip popper-class="ui-hint">
            <UiIcon icon="fas fa-filter" />
            <template #popper>
              {{ $t('common.addFilter') }}
            </template>
          </VTooltip>
        </PropertySelect>
      </UiActionListItem>

      <UiActionListItem @click="stepsStore.deleteExcludedEvent(index)">
        <VTooltip popper-class="ui-hint">
          <UiIcon icon="fas fa-times" />
          <template #popper>
            {{ $t('funnels.excludeSteps.remove') }}
          </template>
        </VTooltip>
      </UiActionListItem>
    </UiActionList>

    <Filter
      v-for="(filter, filterIndex) in item.filters"
      :key="filterIndex"
      :filter="filter"
      :event-ref="item.event"
      :index="filterIndex"
      class="exclude-step-filter"
      @remove-filter="removeFilterForEvent(index, filterIndex)"
      @change-filter-property="(...args) => changeFilterPropertyForEvent(index, ...args)"
      @change-filter-operation="(...args) => changeFilterOperationForEvent(index, ...args)"
      @add-filter-value="(...args) => addFilterValueForEvent(index, ...args)"
      @remove-filter-value="(...args) => removeFilterValueForEvent(index, ...args)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { Tooltip as VTooltip } from 'floating-vue'
import { useI18n } from 'vue-i18n'

import EventSelector from '@/components/events/Events/EventSelector.vue';
import Filter from '@/components/events/Filter.vue';
import PropertySelect from '@/components/events/PropertySelect.vue'
import UiActionList from '@/components/uikit/UiActionList/UiActionList.vue';
import UiActionListItem from '@/components/uikit/UiActionList/UiActionListItem.vue';
import UiButton from '@/components/uikit/UiButton.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'

import {
  FunnelExcludeStepsStepsOneOf1TypeEnum,
  FunnelExcludeStepsStepsOneOfTypeEnum,
} from '@/api'
import { UiSelectGeneric } from '@/components/uikit/UiSelect/UiSelectGeneric';
import { useEventName } from '@/helpers/useEventName';
import { useFilter } from '@/hooks/useFilter';
import { useStepsStore} from '@/stores/funnels/steps';
import { OperationId } from '@/types';

import type { FunnelExcludeStepsSteps } from '@/api';
import type { UiSelectItemInterface } from '@/components/uikit/UiSelect/types';
import type { Value } from '@/types';
import type { EventRef, PropertyRef } from '@/types/events';

const UiSelect = UiSelectGeneric();

const stepsStore = useStepsStore();
const eventName = useEventName()
const { getValues } = useFilter();

const { t } = useI18n()

const excludedEvents = computed(() => stepsStore.excludedEvents)

const excludeSteps = computed<UiSelectItemInterface<string>[]>(() => {
    const groups: UiSelectItemInterface<string>[] =
      stepsStore.steps.length > 2
          ? Array.from({ length: stepsStore.steps.length })
              .map((_, index) => {
                  const idx = index + 2;
                  return {
                      __type: 'item',
                      id: `${index}`,
                      label: `${idx - 1} ${t('funnels.excludeSteps.and')} ${idx}`,
                      value: `${idx - 1}-${idx}`
                  }
              })
          : []

    return [
        ...groups.slice(0, -1),
        {
            __type: 'item',
            id: 'all',
            label: t('funnels.excludeSteps.all'),
            value: 'all',
        },
    ]
})

const editEvent = (eventRef: EventRef, index: number): void => {
    stepsStore.editExcludedEvent({
        index,
        excludedEvent: {
            event: eventRef
        }
    })
}

const editEventSteps = (stepsString: string, index: number): void => {
    const steps = excludeStepsFromString(stepsString);
    stepsStore.editExcludedEvent({
        index,
        excludedEvent: {
            steps
        }
    })
}

const createFilterForEvent = async (payload: PropertyRef, index: number) => {
    stepsStore.editExcludedEvent({
        index,
        excludedEvent: {
            filters: [
                {
                    propRef: payload,
                    opId: OperationId.Eq,
                    values: [],
                    valuesList: await getValues(payload),
                }
            ]
        }
    })
}

const removeFilterForEvent = (index: number, filterIndex: number): void => {
    stepsStore.removeFilterForEvent({index, filterIndex})
}

const changeFilterPropertyForEvent = async (index: number, filterIndex: number, payload: PropertyRef): Promise<void> => {
    stepsStore.editFilterForEvent({
        index,
        filterIndex,
        filter: {
            propRef: payload,
            valuesList: await getValues(payload)
        }
    })
}

const changeFilterOperationForEvent = (index: number, filterIndex: number, payload: OperationId): void => {
    stepsStore.editFilterForEvent({
        index,
        filterIndex,
        filter: {
            opId: payload
        }
    })
}
const addFilterValueForEvent = (index: number, filterIndex: number, payload: Value): void => {
    stepsStore.editFilterForEvent({
        index,
        filterIndex,
        filter: {
            values: [
                ...stepsStore.excludedEvents[index].filters[filterIndex].values,
                payload
            ]
        }
    })
}

const removeFilterValueForEvent = (index: number, filterIndex: number, value: Value): void => {
    stepsStore.editFilterForEvent({
        index,
        filterIndex,
        filter: {
            values: stepsStore
                .excludedEvents[index]
                .filters[filterIndex]
                .values
                .filter(item => item !== value)
        }
    })
}

const excludeStepsFromString = (stepsString: string): FunnelExcludeStepsSteps => {
    if (stepsString === 'all') {
        return {
            type: 'all'
        }
    } else {
        const [from, to] = stepsString.split('-');
        return {
            type: 'between',
            from: Number(from),
            to: Number(to)
        }
    }
}

const excludeStepsToString = (steps: FunnelExcludeStepsSteps): string => {
    if (steps.type === FunnelExcludeStepsStepsOneOfTypeEnum.All) {
        return t('funnels.excludeSteps.all');
    } else if (steps.type === FunnelExcludeStepsStepsOneOf1TypeEnum.Between) {
        return `${steps.from} ${t('funnels.excludeSteps.and')} ${steps.to}`
    } else {
      return ''
    }
}
</script>

<style lang="scss" scoped>
.row-gap {
  row-gap: 0.5rem;
}
</style>
