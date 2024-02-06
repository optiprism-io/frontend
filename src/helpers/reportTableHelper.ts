import {
  Report,
  ReportType,
  EventSegmentation,
  EventSegmentationEvent,
  QuerySimpleTypeEnum,
  QueryAggregatePropertyTypeEnum,
  QueryAggregatePropertyPerGroupTypeEnum,
  PropertyType,
  QueryCountPerGroupTypeEnum,
  QueryFormulaTypeEnum,
} from '@/api'
import useI18n from '@/hooks/useI18n'
import { useLexiconStore } from '@/stores/lexicon'
import { useEventsStore } from '@/stores/eventSegmentation/events'

const getProperyNameString = (propertyId: number, propertyType: PropertyType) => {
  const lexiconStore = useLexiconStore()

  const property = lexiconStore.property({
    id: propertyId,
    type: propertyType,
  })

  return property?.name || propertyId
}

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
      const activeEvent = reportEvent.eventId
        ? lexiconStore.findEventById(reportEvent.eventId)
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
          if (indexQuery.aggregate && indexQuery.propertyId && indexQuery.propertyType) {
            resultString += ` (${getAggregatePropertyString(indexQuery.aggregate)}
            ${getProperyNameString(indexQuery.propertyId, indexQuery.propertyType)})`
          }
          break
        case QueryAggregatePropertyPerGroupTypeEnum.AggregatePropertyPerGroup:
          if (indexQuery.aggregatePerGroup) {
            resultString += `, ${getAggregateString(indexQuery.aggregatePerGroup)}`

            if (indexQuery.aggregate && indexQuery.propertyId && indexQuery.propertyType) {
              resultString += ` (${getAggregatePropertyString(indexQuery.aggregate)}
                 ${getProperyNameString(indexQuery.propertyId, indexQuery.propertyType)}
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
