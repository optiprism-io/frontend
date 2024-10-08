import {
  DidEventRelativeCountTypeEnum,
  EventType,
  PropertyType,
  QueryAggregatePropertyPerGroupTypeEnum,
  QueryAggregatePropertyTypeEnum,
  QueryCountPerGroupTypeEnum,
  QueryFormulaTypeEnum,
  QuerySimpleTypeEnum,
  ReportType,
  SegmentConditionDidEventTypeEnum,
  SegmentConditionHadPropertyValueTypeEnum,
  SegmentConditionHasPropertyValueTypeEnum,
  TimeAfterFirstUseTypeEnum,
  TimeBetweenTypeEnum,
  TimeLastTypeEnum,
  TimeWindowEachTypeEnum,
} from '@/api'
import { TimeTypeEnum } from '@/helpers/periodHelper'
import { i18n } from '@/plugins/i18n'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useStepsStore } from '@/stores/funnels/steps'
import { useLexiconStore } from '@/stores/lexicon'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useReportsStore } from '@/stores/reports/reports'
import { useSegmentsStore } from '@/stores/reports/segments'

import type {
  BreakdownByProperty,
  Event as EventItem,
  EventFilterByProperty,
  EventFilterByPropertyTypeEnum,
  EventGroupedFiltersGroupsInner,
  EventSegmentation,
  EventSegmentationEvent,
  EventSegmentationSegment,
  FunnelQuery,
  FunnelQueryStepsInner,
  Property,
  PropertyRef,
  QueryAggregate,
  QueryAggregatePerGroup,
  QueryAggregateProperty,
  QueryAggregatePropertyPerGroup,
  QueryCountPerGroup,
  QueryFormula,
  QuerySimple,
  TimeAfterFirstUse,
  TimeBetween,
  TimeLast,
  TimeWindowEach,
} from '@/api'
import type { Each } from '@/components/uikit/UiCalendar/UiCalendar'
import type {
  ChartType,
  Event,
  EventBreakdown,
  EventQuery,
} from '@/stores/eventSegmentation/events'
import type { HoldingProperty } from '@/stores/funnels/steps'
import type { FilterGroup } from '@/stores/reports/filters'
import type { Segment } from '@/stores/reports/segments'
import type { Condition, EventQueryRef, EventRef } from '@/types/events'
import type { Filter } from '@/types/filters'
import type { Step } from '@/types/steps'

type Queries =
  | QuerySimple
  | QueryCountPerGroup
  | QueryAggregatePropertyPerGroup
  | QueryAggregateProperty
  | QueryFormula

type GetTime = {
  time: TimeAfterFirstUse | TimeBetween | TimeLast | TimeWindowEach
}

type Period = {
  from: string
  to: string
  last: number
  type: TimeTypeEnum
}

const getTime = (props: GetTime) => {
  let each = null
  const period: Period = {
    from: '',
    to: '',
    last: 0,
    type: TimeTypeEnum.Last,
  }

  switch (props.time.type) {
    case TimeLastTypeEnum.Last:
      period.last = props.time.last
      period.type = TimeTypeEnum.Last
      each = props.time?.unit as Each
      break
    case TimeAfterFirstUseTypeEnum.AfterFirstUse:
      each = props.time?.unit as Each
      period.type = TimeTypeEnum.Last
      break
    case TimeWindowEachTypeEnum.WindowEach:
      each = props.time?.unit as Each
      period.type = TimeTypeEnum.Each
      break
    case TimeBetweenTypeEnum.Between:
      period.from = props.time.from
      period.to = props.time.to
      period.type = TimeTypeEnum.Between
      break
  }

  return {
    each,
    period,
  }
}

const computedFilter = (items: EventFilterByProperty[]) => {
  return items.map(filter => {
    return {
      propRef: {
        type: filter.propertyType as PropertyType,
        name: filter.propertyName || '',
      },
      opId: filter.operation,
      values: filter.value || [],
      valuesList: [],
    }
  })
}

const mapReportToEvents = (items: EventSegmentationEvent[]): Event[] => {
  return items.map((item): Event => {
    return {
      ref: {
        type: item.eventType,
        name: item.eventName || '',
      },
      filters: item.filters ? computedFilter(item.filters) : [],
      queries: item.queries.map((row): EventQuery => {
        const query = row as Queries

        const queryRef: EventQueryRef = {
          type: query.type,
        }

        switch (query.type) {
          case QueryFormulaTypeEnum.Formula:
            queryRef.value = query.formula
            break
          case QuerySimpleTypeEnum.CountEvents:
          case QuerySimpleTypeEnum.CountUniqueGroups:
          case QuerySimpleTypeEnum.DailyActiveGroups:
          case QuerySimpleTypeEnum.WeeklyActiveGroups:
          case QuerySimpleTypeEnum.MonthlyActiveGroups:
            break
          case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
            queryRef.typeGroupAggregate = query.aggregatePerGroup as QueryAggregatePerGroup
          // eslint-disable-next-line no-fallthrough
          case QueryAggregatePropertyTypeEnum.AggregateProperty:
          // eslint-disable-next-line no-duplicate-case,no-fallthrough
          case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
            queryRef.propRef = {
              type: query.propertyType,
              name: query.propertyName || '',
            }
          // eslint-disable-next-line no-duplicate-case,no-fallthrough
          case QueryAggregatePropertyTypeEnum.AggregateProperty:
          // eslint-disable-next-line no-duplicate-case,no-fallthrough
          case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
          case QueryCountPerGroupTypeEnum.CountPerGroup:
            queryRef.typeAggregate = query.aggregate as QueryAggregate
            break
        }

        return {
          queryRef,
          noDelete: item.queries.length === 1,
        }
      }),
      breakdowns: item.breakdowns
        ? item.breakdowns.map((row): EventBreakdown => {
            return {
              propRef: {
                type: row.propertyType as PropertyType,
                name: row.propertyName || '',
              },
            }
          })
        : [],
    }
  })
}

const mapReportToFilterGroups = async (
  items: EventGroupedFiltersGroupsInner[]
): Promise<FilterGroup[]> => {
  return items.map((item): FilterGroup => {
    return {
      condition: item.filtersCondition,
      filters: item.filters
        ? item.filters.map((filter): Filter => {
            return {
              propRef: {
                /* TODO: fix typescript error */
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Unreachable code error
                type: filter.propertyType,
                /* TODO: fix typescript error */
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Unreachable code error
                name: filter.propertyName || '',
              },
              /* TODO: fix typescript error */
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: Unreachable code error
              opId: filter.operation,
              /* TODO: fix typescript error */
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: Unreachable code error
              values: filter.value || [],
              valuesList: [] as string[] | boolean[] | number[],
            }
          })
        : [],
    }
  })
}

const mapReportToSegments = async (items: EventSegmentationSegment[]): Promise<Segment[]> => {
  const lexiconStore = useLexiconStore()

  return await Promise.all(
    items.map(async (item): Promise<Segment> => {
      return {
        name: item.name || '',
        conditions: await Promise.all(
          item.conditions.map(async (row): Promise<Condition> => {
            const condition = row

            const res: Condition = {
              action: {
                name: i18n.global.t(`events.condition.${condition.type}`),
                id: condition.type || '',
              },
              filters: [],
            }

            switch (condition.type) {
              case SegmentConditionDidEventTypeEnum.DidEvent:
                if (condition.eventName) {
                  res.event = {
                    name: condition.eventName || '',
                    ref: {
                      type: condition.eventType || EventType.Regular,
                      name: condition.eventName || '',
                    },
                  }
                }

                if (condition.filters) {
                  res.filters = computedFilter(condition.filters)
                }

                if (condition.aggregate) {
                  res.opId = condition.aggregate.operation

                  if (
                    condition.aggregate.type !== DidEventRelativeCountTypeEnum.RelativeCount &&
                    condition.aggregate?.value
                  ) {
                    res.valueItem = condition.aggregate.value
                  }

                  if (condition.aggregate.time) {
                    const { each, period } = getTime({ time: condition.aggregate.time })
                    res.period = period
                    res.each = each as Each
                  }

                  if (
                    condition.aggregate.type === DidEventRelativeCountTypeEnum.RelativeCount &&
                    condition.aggregate.eventType
                  ) {
                    let event: EventItem | null = null

                    switch (condition.aggregate.eventType) {
                      case EventType.Regular:
                        event = lexiconStore.findEventByName(condition.aggregate.eventName || '')
                        break
                      case EventType.Custom:
                        if (condition.aggregate.eventName) {
                          event = lexiconStore.findCustomEventByName(condition.aggregate.eventName)
                        }
                        break
                    }

                    if (event) {
                      res.compareEvent = {
                        name: event.name,
                        ref: {
                          type: condition.aggregate.eventType as EventType,
                          id: event.id,
                          name: event.name,
                        },
                      }
                    }
                  }
                  res.aggregate = {
                    name: i18n.global.t(`events.aggregates.${condition.aggregate.type}`),
                    id: condition.aggregate.type,
                  }
                }
                break
              case SegmentConditionHadPropertyValueTypeEnum.HadPropertyValue:
                if (condition.time) {
                  const { each, period } = getTime({ time: condition.time })
                  res.period = period
                  res.each = each as Each
                }
              // eslint-disable-next-line no-duplicate-case,no-fallthrough
              case SegmentConditionHadPropertyValueTypeEnum.HadPropertyValue:
              case SegmentConditionHasPropertyValueTypeEnum.HasPropertyValue:
                if (condition.propertyName) {
                  const property: Property | undefined =
                    lexiconStore.findEventPropertyByName(condition.propertyName) ||
                    lexiconStore.findGroupProperty(condition.propertyName)
                  if (property) {
                    res.propRef = {
                      type: PropertyType.Group,
                      id: property?.id,
                      name: property.name || property.displayName || '',
                    }
                    res.valuesList = []
                  }
                }
                res.opId = condition.operation
                res.values = condition.value
            }

            return res
          })
        ),
      }
    })
  )
}

const mapReportToBreakdowns = (items: BreakdownByProperty[]): EventBreakdown[] => {
  return items.map(item => {
    if (item.propertyName) {
      return {
        propRef: {
          type: item.propertyType,
          name: item.propertyName || '',
        },
      }
    } else {
      return {}
    }
  })
}

export const mapReportToSteps = async (items: FunnelQueryStepsInner[]): Promise<Step[]> => {
  return await Promise.all(
    items.map(async (item): Promise<Step> => {
      return {
        events: item.events
          ? await Promise.all(
              item.events.map(async event => {
                return {
                  event: {
                    type: event.eventType,
                    name: event.eventName || '',
                  },
                  filters: event.filters ? computedFilter(event.filters) : [],
                }
              })
            )
          : [],
      } as Step
    })
  )
}

const mapReportToHoldingConstants = (items: PropertyRef[]): HoldingProperty[] => {
  return items.map(item => {
    return {
      name: item?.propertyName || '',
      type: item.propertyType as EventFilterByPropertyTypeEnum,
    }
  })
}

export const funnelsToEvents = () => {
  const eventsStore = useEventsStore()
  const stepsStore = useStepsStore()

  eventsStore.events = stepsStore.steps.reduce((items: Event[], step) => {
    step.events.forEach(stepEvent => {
      items.push({
        ref: stepEvent.event,
        filters: stepEvent.filters,
        breakdowns: [],
        queries: [
          {
            noDelete: true,
            queryRef: {
              name: 'countEvents',
              type: QuerySimpleTypeEnum.CountEvents,
            },
          },
        ],
      })
    })

    return items
  }, [])
}

export const eventsToFunnels = () => {
  const eventsStore = useEventsStore()
  const stepsStore = useStepsStore()

  stepsStore.steps = eventsStore.events.map((event): Step => {
    return {
      events: [
        {
          event: event.ref as EventRef,
          filters: event.filters as Filter[],
        },
      ],
    }
  })
}

export const reportToStores = async (id: number) => {
  const reportsStore = useReportsStore()
  const eventsStore = useEventsStore()
  const filterGroupsStore = useFilterGroupsStore()
  const segmentsStore = useSegmentsStore()
  const breakdownsStore = useBreakdownsStore()
  const stepsStore = useStepsStore()

  reportsStore.reportId = id
  const report = reportsStore.activeReport
  if (report?.query) {
    if (report.type === ReportType.EventSegmentation) {
      const query = report?.query as EventSegmentation
      eventsStore.events = query.events ? mapReportToEvents(query.events) : []
    }
    if (report.type === ReportType.Funnel) {
      const query = report?.query as FunnelQuery
      stepsStore.steps = query?.steps ? await mapReportToSteps(query.steps) : []
      stepsStore.holdingProperties = query?.holdingConstants
        ? mapReportToHoldingConstants(query.holdingConstants)
        : []
    }
    filterGroupsStore.condition = report.query?.filters?.groupsCondition || 'and'
    filterGroupsStore.filterGroups = report.query?.filters?.groups
      ? await mapReportToFilterGroups(report.query.filters.groups)
      : [
          {
            condition: 'and',
            filters: [],
          },
        ]
    if (Array.isArray(report?.query?.segments) && report.query.segments.length) {
      segmentsStore.segments = await mapReportToSegments(report.query.segments)
    }
    if (Array.isArray(report?.query?.breakdowns) && report.query.breakdowns.length) {
      breakdownsStore.breakdowns = mapReportToBreakdowns(report.query.breakdowns)
    }
    eventsStore.chartType = report?.query?.chartType as ChartType
  }
}
