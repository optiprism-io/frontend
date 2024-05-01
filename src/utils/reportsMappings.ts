import i18n from '@/utils/i18n'
import { TimeTypeEnum } from '@/hooks/usePeriod'

import { useStepsStore, HoldingProperty } from '@/stores/funnels/steps'
import { useReportsStore } from '@/stores/reports/reports'
import { useLexiconStore } from '@/stores/lexicon'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore, FilterGroup } from '@/stores/reports/filters'
import { useSegmentsStore, Segment } from '@/stores/reports/segments'
import { Each } from '@/components/uikit/UiCalendar/UiCalendar'
import { Value } from '@/api'
import { useProjectsStore } from '@/stores/projects/projects'

import {
  Property,
  EventType,
  PropertyType,
  ReportType,
  QuerySimple,
  QueryCountPerGroup,
  QueryAggregatePropertyPerGroup,
  QueryAggregateProperty,
  QueryFormula,
  EventSegmentation,
  FunnelQuery,
  QueryFormulaTypeEnum,
  QuerySimpleTypeEnum,
  QueryCountPerGroupTypeEnum,
  QueryAggregatePropertyPerGroupTypeEnum,
  QueryAggregatePropertyTypeEnum,
  EventSegmentationEvent,
  EventGroupedFiltersGroupsInner,
  EventSegmentationSegment,
  DidEventRelativeCountTypeEnum,
  SegmentConditionDidEventTypeEnum,
  SegmentConditionHadPropertyValueTypeEnum,
  SegmentConditionHasPropertyValueTypeEnum,
  TimeBetweenTypeEnum,
  Event as EventItem,
  EventFilterByProperty,
  TimeBetween,
  TimeLast,
  TimeAfterFirstUse,
  TimeWindowEach,
  TimeLastTypeEnum,
  TimeAfterFirstUseTypeEnum,
  TimeWindowEachTypeEnum,
  BreakdownByProperty,
  FunnelQueryStepsInner,
  PropertyRef,
  QueryAggregate,
  QueryAggregatePerGroup,
  EventFilterByPropertyTypeEnum,
  EventGroupedFiltersGroupsConditionEnum,
} from '@/api'

type Queries =
  | QuerySimple
  | QueryCountPerGroup
  | QueryAggregatePropertyPerGroup
  | QueryAggregateProperty
  | QueryFormula

import {
  useEventsStore,
  Event,
  EventQuery,
  EventBreakdown,
  ChartType,
} from '@/stores/eventSegmentation/events'
import { Step } from '@/types/steps'
import {
  EventRef,
  EventQueryRef,
  Condition,
  PropertyRef as PropertyRefEvent,
  UserCustomProperty,
} from '@/types/events'
import { Filter } from '@/types/filters'
import { apiClient } from '@/api/services/apiClient'

type GetValues = {
  eventName?: string
  eventType?: EventType
  propertyName: string
  propertyType?: PropertyType
}

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

const getValues = async (props: GetValues) => {
  const projectsStore = useProjectsStore()
  let valuesList: Value[] = []

  const res = await apiClient.propertyValues.propertyValuesList(projectsStore.projectId, {
    eventName: props.eventName,
    propertyType: props.propertyType || PropertyType.User,
    eventType: props.eventType || EventType.Regular,
    propertyName: props.propertyName,
  })
  if (res?.data?.data) {
    valuesList = res.data.data
  }
  return valuesList
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
      queries: item.queries.map((row, i): EventQuery => {
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
          case QueryAggregatePropertyTypeEnum.AggregateProperty:
          case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
            queryRef.propRef = {
              type: query.propertyType,
              name: query.propertyName || '',
            }
          case QueryAggregatePropertyTypeEnum.AggregateProperty:
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
            const valuesList: Value[] = []

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
              valuesList: valuesList as string[] | boolean[] | number[],
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
                name: i18n.t(`events.condition.${condition.type}`),
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
                    name: i18n.t(`events.aggregates.${condition.aggregate.type}`),
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
              case SegmentConditionHadPropertyValueTypeEnum.HadPropertyValue:
              case SegmentConditionHasPropertyValueTypeEnum.HasPropertyValue:
                if (condition.propertyName) {
                  const property: Property | undefined =
                    lexiconStore.findEventPropertyByName(condition.propertyName) ||
                    lexiconStore.findUserPropertyByName(condition.propertyName)
                  if (property) {
                    res.propRef = {
                      type: PropertyType.User,
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
