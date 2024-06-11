import {
  ReportType,
  QuerySimpleTypeEnum,
  QueryAggregatePropertyTypeEnum,
  QueryAggregatePropertyPerGroupTypeEnum,
  QueryCountPerGroupTypeEnum,
  QueryFormulaTypeEnum,
} from '@/api'
import useI18n from '@/hooks/useI18n'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'

import type {
  Report,
  EventSegmentation,
  EventSegmentationEvent} from '@/api';

const getAggregateString = (key: string) => {
  const { t } = useI18n()

  return t(`events.aggregates.${key}`)
}

const getAggregatePropertyString = (key: string) => {
  const { t } = useI18n()

  return t(`events.aggregateProperty.${key}`)
}

export const getQueryFormattedValue = (value: string, report: Report) => {
  const { t } = useI18n()
  const lexiconStore = useLexiconStore()
  const eventsStore = useEventsStore()

  if (report.type === ReportType.EventSegmentation) {
    const indexes = value.split('_')
    const eventId = Number(indexes[0])
    const queryId = Number(indexes[1])

    const queryReport = report.query as EventSegmentation
    const events = queryReport.events || []

    const reportEvent = events[eventId] as EventSegmentationEvent
    const indexQuery = (reportEvent?.queries || [])[queryId]

    if (reportEvent && indexQuery) {
      const activeEvent = reportEvent.eventName
        ? lexiconStore.findEventByName(reportEvent.eventName)
        : null
      let resultString = activeEvent?.displayName || reportEvent.eventName || ''

      switch (indexQuery.type) {
        case QuerySimpleTypeEnum.CountEvents:
        case QuerySimpleTypeEnum.CountUniqueGroups:
        case QuerySimpleTypeEnum.DailyActiveGroups:
        case QuerySimpleTypeEnum.MonthlyActiveGroups:
        case QuerySimpleTypeEnum.WeeklyActiveGroups:
          resultString += ` (${t(`events.query.${indexQuery.type}`)})`
          break
        case QueryAggregatePropertyTypeEnum.AggregateProperty:
          if (indexQuery.aggregate && indexQuery.propertyName && indexQuery.propertyType) {
            resultString += ` (${getAggregatePropertyString(indexQuery.aggregate)} ${indexQuery.propertyName})`
          }
          break
        case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
          if (indexQuery.aggregatePerGroup) {
            resultString += `, ${getAggregateString(indexQuery.aggregatePerGroup)}`

            if (indexQuery.aggregate && indexQuery.propertyName && indexQuery.propertyType) {
              resultString += ` (${getAggregatePropertyString(indexQuery.aggregate)}
                 ${indexQuery.propertyName}
                 ${t('events.per')} ${eventsStore.group})`
            }
          }
          break
        case QueryCountPerGroupTypeEnum.CountPerGroup:
          if (indexQuery.aggregate) {
            resultString += `,
                ${getAggregateString(indexQuery.aggregate)} (
                ${getAggregateString(indexQuery.type)} ${t('events.per')} ${eventsStore.group}
              )`
          }
          break
        case QueryFormulaTypeEnum.Formula:
          if (indexQuery.formula) {
            resultString += `, ${getAggregateString(indexQuery.type)}
            ( ${indexQuery.formula} )`
          }
          break
        default:
          resultString += `(${value})`
      }

      return resultString
    } else {
      return value
    }
  } else {
    return value
  }
}
