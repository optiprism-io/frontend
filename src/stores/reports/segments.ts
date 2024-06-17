import { defineStore } from 'pinia'

import {
  EventType,
  PropertyType,
  SegmentConditionHasPropertyValueTypeEnum,
  SegmentConditionDidEventTypeEnum,
  SegmentConditionHadPropertyValueTypeEnum,
  TimeBetweenTypeEnum,
  TimeWindowEachTypeEnum,
  TimeLastTypeEnum,
  DidEventCountTypeEnum,
  DidEventRelativeCountTypeEnum,
  DidEventAggregatePropertyTypeEnum,
  EventFilterByPropertyTypeEnum
} from '@/api'
import { usePropertyValues } from '@/hooks/usePropertyValues'
import { useLexiconStore } from '@/stores/lexicon'
import { OperationId } from '@/types'

import { useProfileStore } from '../profile/profile'

import type {
  Event,
  Property,
  PropertyFilterOperation,
  EventSegmentationSegment,
  EventSegmentationSegmentConditionsInner,
  SegmentConditionHasPropertyValue,
  SegmentConditionDidEvent,
  SegmentConditionHadPropertyValue,
  SegmentConditionHadPropertyValueTime,
  TimeUnit,
  DidEventCount,
  DidEventRelativeCount,
  DidEventAggregateProperty,
  DidEventHistoricalCount,
  QueryAggregate,
  EventFilterByProperty,
  SegmentConditionDidEventAllOfAggregate
} from '@/api';
import type {
  ChangeEventCondition,
  ChangeFilterOperation,
  ChangeFilterPropertyCondition,
  FilterValueCondition,
  Ids,
  PayloadChangeAggregateCondition,
  PayloadChangeEach,
  PayloadChangeValueItem,
  PeriodConditionPayload,
  RemoveFilterCondition,
} from '@/components/events/Segments/Segments'
import type { Value } from '@/types';
import type { Condition, ConditionFilter, PropertyRef } from '@/types/events'

export interface Segment {
  name: string
  conditions?: Condition[]
}

type SegmentsStore = {
  segments: Segment[]
}

const computedValueTime = (
  item: Condition,
  timezone: string
): SegmentConditionHadPropertyValueTime => {
  if (item.period?.type === TimeBetweenTypeEnum.Between) {
    return {
      type: TimeBetweenTypeEnum.Between,
      from: String(item.period.from),
      to: String(item.period.to),
      timezone,
    }
  }

  if (item.period?.type === TimeLastTypeEnum.Last) {
    return {
      type: TimeLastTypeEnum.Last,
      last: Number(item.period.last),
      unit: 'day',
    }
  }

  return {
    type: TimeWindowEachTypeEnum.WindowEach,
    unit: item.each as TimeUnit,
  }
}

const computedValueAggregate = (
  item: Condition
): DidEventCount | DidEventRelativeCount | DidEventAggregateProperty | DidEventHistoricalCount => {
  const lexiconStore = useLexiconStore()
  const profileStore = useProfileStore()

  const time = computedValueTime(item, profileStore.profile.timezone)
  const operation = item.opId as PropertyFilterOperation

  if (item.aggregate?.id === DidEventAggregatePropertyTypeEnum.AggregateProperty && item.propRef) {
    const property: Property | undefined =
      item.propRef.type === PropertyType.Event
        ? lexiconStore.findEventPropertyByName(item.propRef.name)
        : lexiconStore.findGroupProperty(item.propRef.name)

    if (property) {
      const aggregate: SegmentConditionDidEventAllOfAggregate = {
        type: DidEventAggregatePropertyTypeEnum.AggregateProperty,
        time,
        operation,
        value: Number(item.valueItem),
        propertyName: property.name,
        propertyType: PropertyType.Group,
        aggregate: item.aggregate.typeAggregate as QueryAggregate,
      }

      if (item.propRef.group || item.propRef.group === 0) {
        aggregate.group = property.groupId;
      }

      return aggregate
    }
  }

  if (item.aggregate?.id === DidEventRelativeCountTypeEnum.RelativeCount && item.compareEvent) {
    const eventItem: Event =
      item.compareEvent.ref.type === EventType.Regular
        ? lexiconStore.findEventByName(item.compareEvent.ref.name)
        : lexiconStore.findCustomEventByName(item.compareEvent.ref.name)

    return {
      type: DidEventRelativeCountTypeEnum.RelativeCount,
      operation,
      time,
      eventName: eventItem.name,
      eventType:
        item.compareEvent.ref.type === EventType.Regular ?
          EventType.Custom :
          EventType.Regular,
    }
  }

  return {
    type: DidEventCountTypeEnum.Count,
    value: Number(item.valueItem),
    operation,
    time,
  }
}

export const useSegmentsStore = defineStore('segments', {
  state: (): SegmentsStore => ({
    segments: [],
  }),
  getters: {
    segmentationItems(): EventSegmentationSegment[] {
      const lexiconStore = useLexiconStore()
      const profileStore = useProfileStore()

      return this.segments.reduce((acc: EventSegmentationSegment[], segment) => {
        const item = {
          name: segment.name,
          conditions: segment.conditions
            ? segment.conditions.reduce(
                (items: EventSegmentationSegmentConditionsInner[], item) => {
                  if (item.action?.id === SegmentConditionDidEventTypeEnum.DidEvent && item.event) {
                    if (
                      item?.aggregate?.id === DidEventRelativeCountTypeEnum.RelativeCount &&
                      !item.compareEvent
                    ) {
                      return items
                    }

                    if (
                      item?.aggregate?.id === DidEventAggregatePropertyTypeEnum.AggregateProperty &&
                      !item.propRef
                    ) {
                      return items
                    }

                    const eventItem: Event =
                      item.event.ref.type === EventType.Regular
                        ? lexiconStore.findEventByName(item.event.ref.name)
                        : lexiconStore.findCustomEventByName(item.event.ref.name)

                    const condition: SegmentConditionDidEvent = {
                      type: SegmentConditionDidEventTypeEnum.DidEvent,
                      eventName: eventItem.name,
                      eventType: item.event.ref.type,
                      filters: item.filters
                        .filter(item => item.propRef)
                        .reduce((items: EventFilterByProperty[], filterRef) => {
                          if (filterRef.propRef) {
                            const property: Property | undefined =
                              filterRef?.propRef.type === PropertyType.Event
                                ? lexiconStore.findEventPropertyByName(filterRef.propRef.name)
                                : lexiconStore.findGroupProperty(filterRef.propRef.name)

                            if (property) {
                              const filter: EventFilterByProperty = {
                                type: EventFilterByPropertyTypeEnum.Property,
                                propertyName: property.name,
                                propertyType: filterRef?.propRef.type,
                                operation: filterRef.opId as PropertyFilterOperation,
                                value: filterRef.values,
                              }

                              if (filterRef.propRef?.group || filterRef.propRef?.group === 0) {
                                filter.group = filterRef.propRef.group
                              }

                              items.push(filter)
                            }
                          }

                          return items
                        }, []),
                      aggregate: computedValueAggregate(item),
                    }

                    items.push(condition)
                  }

                  if (item.propRef && item.action?.id) {
                    const property: Property | undefined =
                      item.propRef.type === PropertyType.Event
                        ? lexiconStore.findEventPropertyByName(item.propRef.name)
                        : lexiconStore.findGroupProperty(item.propRef.name)

                    if (property) {
                      if (
                        item.action?.id ===
                        SegmentConditionHasPropertyValueTypeEnum.HasPropertyValue
                      ) {
                        const condition: SegmentConditionHasPropertyValue = {
                          type: SegmentConditionHasPropertyValueTypeEnum.HasPropertyValue,
                          propertyName: property.name,
                          operation: item.opId as PropertyFilterOperation,
                          value: item.values,
                        }

                        items.push(condition)
                      }

                      if (
                        item.action?.id ===
                        SegmentConditionHadPropertyValueTypeEnum.HadPropertyValue
                      ) {
                        const condition: SegmentConditionHadPropertyValue = {
                          type: SegmentConditionHadPropertyValueTypeEnum.HadPropertyValue,
                          propertyName: property.name,
                          operation: item.opId as PropertyFilterOperation,
                          value: item.values,
                          time: computedValueTime(item, profileStore.profile.timezone),
                        }

                        items.push(condition)
                      }
                    }
                  }

                  return items
                },
                []
              )
            : [],
        }

        if (item.conditions.length) {
          acc.push(item)
        }

        return acc
      }, [])
    },
    isSelectedAnySegments(): boolean {
      return Boolean(this.segmentationItems.length)
    },
  },
  actions: {
    inputCalendarEach(payload: PayloadChangeEach) {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]
        if (condition) {
          condition.each = payload.value
          condition.period = {
            type: 'each',
          }
        }
      }
    },
    inputValue(payload: PayloadChangeValueItem) {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]
        if (condition) {
          condition.valueItem = payload.value
        }
      }
    },
    changeAggregateCondition(payload: PayloadChangeAggregateCondition) {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]
        if (condition) {
          delete condition.propRef
          condition.aggregate = payload.value
          condition.opId = OperationId.Gte
          condition.period = {
            type: 'each',
          }
          condition.each = 'day'
          condition.filters = []
          condition.values = []
          condition.valueItem = 1
        }
      }
    },
    removeFilterValueCondition(payload: FilterValueCondition) {
      const segment = this.segments[payload.idxParent]
      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition) {
          condition.filters[payload.idxFilter].values = condition.filters[
            payload.idxFilter
          ].values.filter(v => v !== payload.value)
        }
      }
    },
    addFilterValueCondition(payload: FilterValueCondition) {
      const segment = this.segments[payload.idxParent]
      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition) {
          condition.filters[payload.idxFilter].values.push(payload.value)
        }
      }
    },
    changeFilterOperation(payload: ChangeFilterOperation) {
      const segment = this.segments[payload.idxParent]
      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition) {
          condition.filters[payload.idxFilter].opId = payload.opId
          condition.filters[payload.idxFilter].values = []
        }
      }
    },
    changeEventCondition(payload: ChangeEventCondition) {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition) {
          const lexiconStore = useLexiconStore()
          const event = lexiconStore.findEvent(payload.ref)

          condition.event = {
            name: 'displayName' in event ? event?.displayName || event.name : event.name,
            ref: payload.ref,
          }
          condition.filters = []
        }
      }
    },
    changeCompareEventCondition(payload: ChangeEventCondition) {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition) {
          const lexiconStore = useLexiconStore()
          const event = lexiconStore.findEvent(payload.ref)

          condition.compareEvent = {
            name: 'displayName' in event ? event?.displayName || event.name : event.name,
            ref: payload.ref,
          }
        }
      }
    },
    async changeFilterPropertyCondition(payload: ChangeFilterPropertyCondition) {
      const { getValues } = usePropertyValues()
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition && condition.event) {
          const eventRef = condition.event.ref
          const valuesList: Value[] = await getValues(payload.propRef, eventRef)

          condition.filters[payload.idxFilter] = {
            propRef: payload.propRef,
            opId: OperationId.Eq,
            values: [],
            valuesList: valuesList,
          }
        }
      }
    },
    removeFilterCondition(payload: RemoveFilterCondition): void {
      const segment = this.segments[payload.idxParent]
      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition) {
          condition.filters.splice(payload.idxFilter, 1)
        }
      }
    },
    async addFilterCondition(payload: Ids, ref: PropertyRef) {
      const { getValues } = usePropertyValues()
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]
        const emptyFilter = condition.filters.find(
          (filter): boolean => filter.propRef === undefined
        )

        if (emptyFilter) {
          return
        }

        if (condition && condition.filters && condition.event) {
          const eventRef = condition.event.ref
          const valuesList: Value[] = await getValues(ref, eventRef)

          condition.filters.push(<ConditionFilter>{
            propRef: ref,
            opId: OperationId.Eq,
            values: [],
            valuesList,
          })
        }
      }
    },
    changePeriodCondition(payload: PeriodConditionPayload): void {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        const condition = segment.conditions[payload.idx]

        if (condition && condition.period) {
          condition.period = {
            from: payload.value.value.from || '',
            to: payload.value.value.to || '',
            last: payload.value.last,
            type: payload.value.type,
          }
          delete condition.each
        }
      }
    },
    removeValueCondition(idx: number, idxSegment: number, value: Value): void {
      const segment = this.segments[idxSegment]

      if (segment && segment.conditions) {
        const condition = segment.conditions[idx]
        if (condition && condition.values) {
          condition.values = condition.values.filter(v => v !== value)
        }
      }
    },
    addValueCondition(idx: number, idxSegment: number, value: Value): void {
      const segment = this.segments[idxSegment]

      if (segment && segment.conditions) {
        const condition = segment.conditions[idx]
        if (condition && condition.values) {
          condition.values.push(value)
        } else {
          condition.values = [value]
        }
      }
    },
    changeOperationCondition(idx: number, idxSegment: number, opId: OperationId): void {
      const segment = this.segments[idxSegment]

      if (segment && segment.conditions) {
        const condition = segment.conditions[idx]
        if (condition) {
          condition.opId = opId
          condition.values = []
        }
      }
    },
    async changePropertyCondition(idx: number, idxSegment: number, ref: PropertyRef) {
      const segment = this.segments[idxSegment]
      if (segment && segment.conditions) {
        const condition = segment.conditions[idx]
        if (condition) {
          condition.propRef = ref
          condition.opId = OperationId.Eq
          condition.values = []
          condition.period = {
            type: 'each',
          }
          condition.each = 'day'
        }
      }
    },
    async getConditionValue(idx: number, idxSegment: number) {
      const { getValues } = usePropertyValues()
      const segment = this.segments[idxSegment]

      if (segment?.conditions) {
        const condition = segment.conditions[idx]

        if (condition?.propRef && condition.event) {
          const valuesList = await getValues(condition.propRef, condition.event?.ref)

          condition.valuesList = valuesList
        }
      }
    },
    changeActionCondition(idx: number, idxSegment: number, ref: { id: string; name: string }) {
      const segment = this.segments[idxSegment]

      if (segment && segment.conditions) {
        const condition = segment.conditions[idx]
        if (condition) {
          delete condition.propRef
          condition.action = ref
          condition.period = {}
          condition.filters = []
        }
      }
    },
    removeCondition(payload: Ids) {
      const segment = this.segments[payload.idxParent]

      if (segment && segment.conditions) {
        segment.conditions.splice(payload.idx, 1)

        if (!segment.conditions.length) {
          this.deleteSegment(payload.idxParent)
        }
      }
    },
    addConditionSegment(idx: number, ref?: { id: string; name: string }) {
      const segment = this.segments[idx]

      if (segment.conditions) {
        const length = segment.conditions.length - 1
        if (segment.conditions[length] && segment.conditions[length].action) {
          segment.conditions.push({
            filters: [],
            action: ref,
            period: {},
          })
        }
      } else {
        segment.conditions = [
          {
            filters: [],
            action: ref,
            period: {},
          },
        ]
      }
    },
    renameSegment(name: string, idx: number) {
      const segment = this.segments[idx]
      if (segment) {
        segment.name = name
      }
    },
    deleteSegment(idx: number) {
      this.segments.splice(idx, 1)
    },
    addSegment(name: string) {
      this.segments.push({ name })
    },
    betweenAddCondition(idx: number, indexParent: number, ref: { id: string; name: string }) {
      const segment = this.segments[indexParent]
      if (segment && segment.conditions) {
        segment.conditions.splice(idx + 1, 0, {
          filters: [],
          period: {},
          action: ref,
        })
      }
    },
  },
})
