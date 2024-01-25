import {
    Report,
    ReportType,
    EventSegmentation,
    EventSegmentationEvent,
    EventSegmentationEventAllOfQueries,
    QueryAggregatePropertyPerGroupTypeEnum,
    QuerySimpleTypeEnum,
} from '@/api'
import useI18n from '@/hooks/useI18n';
import { useLexiconStore } from '@/stores/lexicon';


export const getEventString = (value: string, report: Report) => {
    const { t } = useI18n();
    const lexiconStore = useLexiconStore();

    if (report.type === ReportType.EventSegmentation) {
        const indexes = value.split('_')
        const eventId = Number(indexes[0])
        const queryId = Number(indexes[1])

        const queryReport = report.query as EventSegmentation
        const events = queryReport.events || []

        const reportEvent = events[eventId] as EventSegmentationEvent
        const indexQuery = (reportEvent?.queries || [])[queryId] as EventSegmentationEventAllOfQueries

        if (reportEvent && indexQuery) {
            const activeEvent = reportEvent.eventId ? lexiconStore.findEventById(reportEvent.eventId) : null;
            let resultString = activeEvent?.displayName || reportEvent.eventName || '';

            switch (indexQuery.type) {
                case QuerySimpleTypeEnum.CountEvents:
                case QuerySimpleTypeEnum.CountUniqueGroups:
                case QuerySimpleTypeEnum.DailyActiveGroups:
                case QuerySimpleTypeEnum.MonthlyActiveGroups:
                case QuerySimpleTypeEnum.WeeklyActiveGroups:
                    resultString += `(${t(`events.query.${indexQuery.type}`)})`;
                // TODO
                default:
                    resultString += `(${value})`
            }

            return resultString;
        } else {
            return value;
        }
    } else {
        return value;
    }
}