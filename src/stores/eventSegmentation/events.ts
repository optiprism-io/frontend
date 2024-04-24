import { defineStore } from 'pinia'
import { EventRef, PropertyRef, EventQueryRef } from '@/types/events'
import { OperationId, Value, Group } from '@/types'
import { getYYYYMMDD } from '@/helpers/getStringDates'
import { getLastNDaysRange } from '@/helpers/calendarHelper'
import {
  PropertyType,
  TimeUnit,
  EventSegmentation,
  EventRecordsListRequestTime,
  EventChartType,
  EventSegmentationEvent,
  QueryAggregatePropertyTypeEnum,
  QueryAggregatePropertyPerGroupTypeEnum,
  QueryCountPerGroupTypeEnum,
  QueryFormulaTypeEnum,
  EventFilterByProperty,
  EventType,
  QueryAggregateProperty,
  QueryAggregate,
  QuerySimple,
  QuerySimpleTypeEnum,
  BreakdownByProperty,
  EventSegmentationEventAllOfQueries,
} from '@/api'
import { useLexiconStore } from '@/stores/lexicon'
import { useFilterGroupsStore } from '../reports/filters'
import { useBreakdownsStore } from '../reports/breakdowns'
import { usePeriod, TimeTypeEnum } from '@/hooks/usePeriod'

export type ChartType = 'line' | 'pie' | 'column'

export interface EventFilter {
  propRef?: PropertyRef
  opId: OperationId
  values: Value[]
  valuesList: Value[] | []
  error?: boolean
  propertyType?: 'string'
}

export interface EventBreakdown {
  propRef?: PropertyRef
  error?: boolean
}

export interface EventQuery {
  queryRef?: EventQueryRef
  noDelete?: boolean
}

export type Event = {
  ref: EventRef
  filters: EventFilter[]
  breakdowns: EventBreakdown[]
  queries: EventQuery[]
}

export interface EventPayload {
  event: Event
  index: number
}

export type Events = {
  events: Event[]
  group: Group

  controlsGroupBy: TimeUnit
  controlsPeriod: string
  period: {
    from: string
    to: string
    last: number
    type: TimeTypeEnum,
  }
  compareTo: TimeUnit | string
  compareOffset: number
  chartType: ChartType | string

  editCustomEvent: number | null
}

export const initialQuery = <EventQuery[]>[
  {
    queryRef: <EventQueryRef>{
      type: 'countEvents',
      name: 'countEvents',
    },
    noDelete: true,
  },
]

const computedEventProperties = (type: PropertyType, items: any): PropertyRef[] => {
  return items.map((item: any) => {
    return {
      type: type,
      id: item.id,
    }
  })
}

export const useEventsStore = defineStore('events', {
  state: (): Events => ({
    events: [],
    group: Group.User,

    controlsGroupBy: 'day',
    controlsPeriod: '30',
    period: {
      from: '',
      to: '',
      type: TimeTypeEnum.Last,
      last: 30,
    },
    compareTo: '',
    compareOffset: 1,
    chartType: 'line',
    editCustomEvent: null,
  }),
  getters: {
    ifTimeFilterChange(): boolean {
      return false
    },
    timeRequest(): EventRecordsListRequestTime {
      const { getRequestTime } = usePeriod()

      return getRequestTime(
        this.period.type,
        this.controlsPeriod,
        this.period.from,
        this.period.to,
        this.period.last
      )
    },
    hasSelectedEvents(): boolean {
      return Array.isArray(this.events) && Boolean(this.events.length)
    },
    allSelectedEventPropertyRefs() {
      const lexiconStore = useLexiconStore()
      const items: PropertyRef[] = []

      this.events.forEach(item => {
        const eventRef = item.ref
        items.push(
          ...computedEventProperties(PropertyType.Event, lexiconStore.findEventProperties(eventRef))
        )
        items.push(
          ...computedEventProperties(
            PropertyType.Custom,
            lexiconStore.findEventCustomProperties(eventRef)
          )
        )
      })

      return [
        ...new Set(items),
        ...computedEventProperties(PropertyType.User, lexiconStore.userProperties),
      ]
    },
    propsForEventSegmentationResult(): EventSegmentation {
      const lexiconStore = useLexiconStore()
      const filterGroupsStore = useFilterGroupsStore()
      const breakdownsStore = useBreakdownsStore()

      const props: EventSegmentation = {
        time: this.timeRequest,
        group: this.group,
        intervalUnit: this.controlsGroupBy,
        chartType: this.chartType as EventChartType,
        analysis: {
          type: 'linear',
        },
        events: this.events.reduce((acc, item) => {
          const eventLexicon = lexiconStore.findEvent(item.ref)

          const event: EventSegmentationEvent = {
            eventType: item.ref.type as EventType,
            eventName: eventLexicon.name,
            queries: item.queries.reduce((acc, query) => {
              if (query.queryRef) {
                const type = query.queryRef?.type

                switch (type) {
                  case QueryFormulaTypeEnum.Formula:
                    if (query.queryRef.value) {
                      acc.push({
                        formula: query.queryRef.value || '',
                        type: type,
                      })
                    }
                    break
                  case QuerySimpleTypeEnum.CountEvents:
                  case QuerySimpleTypeEnum.CountUniqueGroups:
                  case QuerySimpleTypeEnum.DailyActiveGroups:
                  case QuerySimpleTypeEnum.WeeklyActiveGroups:
                  case QuerySimpleTypeEnum.MonthlyActiveGroups:
                    acc.push({
                      type: query.queryRef?.type,
                    } as QuerySimple)
                    break
                  case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
                  case QueryAggregatePropertyTypeEnum.AggregateProperty:
                    if (query?.queryRef?.propRef) {
                      const prop = {
                        type: type,
                        propertyType: query.queryRef.propRef.type,
                        propertyName: query.queryRef.propRef.name,
                        aggregate: query.queryRef.typeAggregate || QueryAggregate.Avg,
                      }

                      if (type === QueryAggregatePropertyTypeEnum.AggregateProperty) {
                        acc.push({
                          ...(prop as QueryAggregateProperty),
                          type: QueryAggregatePropertyTypeEnum.AggregateProperty,
                        })
                      }

                      if (
                        type === QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup &&
                        query.queryRef.typeGroupAggregate
                      ) {
                        acc.push({
                          ...prop,
                          aggregatePerGroup:
                            query.queryRef.typeGroupAggregate || QueryAggregate.Avg,
                          type: QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup,
                        })
                      }
                    }
                    break
                  case QueryCountPerGroupTypeEnum.CountPerGroup:
                    acc.push({
                      type: QueryCountPerGroupTypeEnum.CountPerGroup,
                      aggregate: query.queryRef.typeAggregate || QueryAggregate.Avg,
                    })
                    break
                }
              }

              return acc
            }, [] as EventSegmentationEventAllOfQueries[]),
          }

          if (item.breakdowns.length) {
            event.breakdowns = item.breakdowns.map(item => {
              return {
                type: 'property',
                propertyType: item.propRef?.type as BreakdownByProperty['propertyType'],
                propertyName: item.propRef?.name || '',
              }
            })
          }

          if (item.filters.length) {
            const filters = item.filters.reduce(
              (acc: EventFilterByProperty[], item): EventFilterByProperty[] => {
                if (
                  item.propRef &&
                  (item.opId === OperationId.Empty ||
                    item.opId === OperationId.Exists ||
                    item.opId === OperationId.True ||
                    item.opId === OperationId.False ||
                    item.values.length)
                ) {
                  const filter: EventFilterByProperty = {
                    type: 'property',
                    propertyName: item.propRef?.name || '',
                    propertyType: item.propRef?.type || 'event',
                    operation: item.opId
                  }

                  if (item.values.length) {
                    filter.value = item.values
                  }

                  acc.push(filter)
                }
                return acc
              },
              []
            )

            if (filters.length) {
              event.filters = filters
            }
          }

          if (event.queries.length) {
            acc.push(event)
          }

          return acc
        }, [] as EventSegmentationEvent[]),
      }

      if (breakdownsStore.isSelectedAnyBreakdown) {
        props.breakdowns = breakdownsStore.breakdownsItems
      }
      // TODO feature
      // if (segmentsStore.isSelectedAnySegments) {
      //   props.segments = segmentsStore.segmentationItems
      // }
      if (
        filterGroupsStore.filters.groups.length &&
        filterGroupsStore.filters.groups[0].filters?.length
      ) {
        props.filters = filterGroupsStore.filters
      }

      return props
    },
  },
  actions: {
    setEditCustomEvent(payload: number | null) {
      this.editCustomEvent = payload
    },
    setEvent(payload: EventPayload) {
      this.events[payload.index] = payload.event
    },
    initPeriod(): void {
      const lastNDateRange = getLastNDaysRange(20)
      this.period = {
        from: getYYYYMMDD(lastNDateRange.from),
        to: getYYYYMMDD(new Date()),
        type: 'last',
        last: 20,
      }
    },
    addEventByRef(ref: EventRef, initQuery?: boolean): void {
      switch (ref.type) {
        case EventType.Regular:
          this.addEvent(ref.name, initQuery)
          break
        case EventType.Custom:
          this.addCustomEvent(ref.name)
          break
      }
    },
    addEvent(payload: string, initQuery = true): void {
      this.events.push(<Event>{
        ref: <EventRef>{
          type: EventType.Regular,
          name: payload,
        },
        filters: [],
        breakdowns: [],
        queries: initQuery ? initialQuery : [],
      })
    },
    addCustomEvent(payload: string): void {
      this.events.push(<Event>{
        ref: <EventRef>{
          type: EventType.Custom,
          name: payload,
        },
        filters: [],
        breakdowns: [],
        queries: initialQuery,
      })
    },
    deleteEvent(idx: number): void {
      this.events.splice(idx, 1)
    },

    /**
     * Breakdown
     *
     * You cannot create two identical groupings.
     * The grouping can be removed by hovering and clicking on the cross.
     *
     * @func removeBreakdown
     * @func addBreakdown
     * @func changeBreakdownProperty
     */
    removeBreakdown(eventIdx: number, breakdownIdx: number): void {
      this.events[eventIdx].breakdowns.splice(breakdownIdx, 1)
    },
    addBreakdown(idx: number): void {
      const emptyBreakdown = this.events[idx].breakdowns.findIndex(
        (breakdown): boolean => breakdown.propRef === undefined
      )

      if (emptyBreakdown !== -1) {
        this.removeBreakdown(idx, emptyBreakdown)
      }

      this.events[idx].breakdowns.push(<EventFilter>{
        propRef: undefined,
      })
    },
    changeBreakdownProperty(eventIdx: number, breakdownIdx: number, propRef: PropertyRef) {
      this.events[eventIdx].breakdowns[breakdownIdx] = <EventFilter>{
        propRef: propRef,
      }
    },

    /**
     * Query
     *
     * @func removeQuery
     * @func addQuery
     * @func changeQuery
     */
    removeQuery(eventIdx: number, queryIdx: number): void {
      this.events[eventIdx].queries.splice(queryIdx, 1)
    },
    addQuery(idx: number): void {
      const emptyQueryIndex = this.events[idx].queries.findIndex(
        (query): boolean => query.queryRef === undefined
      )

      if (emptyQueryIndex !== -1) {
        this.removeQuery(idx, emptyQueryIndex)
      }

      this.events[idx].queries.push(<EventQuery>{
        queryRef: undefined,
      })
    },
    changeQuery(eventIdx: number, queryIdx: number, queryRef: EventQueryRef) {
      const queries = [...this.events[eventIdx].queries]

      queries[queryIdx] = <EventQuery>{
        queryRef: queryRef,
        noDelete: false,
      }

      this.events[eventIdx].queries = queries
    },
  },
})
