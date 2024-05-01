import { defineStore } from 'pinia'
import {
  EventFilterByProperty,
  EventRecordRequestEvent,
  EventType,
  PropertyFilterOperation,
  EventRecordsListRequest,
  DataTableResponseColumnsInner,
  EventRecordsListRequestTime,
  PropertyRef,
  PropertyType,
} from '@/api'
import { Event } from '@/stores/eventSegmentation/events'
import { useProjectsStore } from '@/stores/projects/projects'
import { usePeriod, TimeTypeEnum } from '@/hooks/usePeriod'
import { useLexiconStore } from '../lexicon'
import { apiClient } from '@/api/apiClient'

export interface Report {
  name: string
  properties: {
    [key: string]: string | number
  }
  userProperties: {
    [key: string]: string | number
  }
  matchedCustomEvents: Array<{
    id: number | string
  }>
}

type LiveStreamStore = {
  events: Event[]
  controlsPeriod: string
  period: {
    from: string
    to: string
    last: number
    type: TimeTypeEnum
  }
  columns: Array<DataTableResponseColumnsInner>
  activeColumns: PropertyRef[]
  loading: boolean
  eventPopup: boolean
}

const getParamsEventsForRequest = (events: Event[]): EventRecordRequestEvent[] => {
  return events.reduce((items: EventRecordRequestEvent[], event) => {
    const item: EventRecordRequestEvent = {
      eventName: event.ref.name,
      eventType: event.ref.type as EventType,
      filters: event.filters.reduce((acc: EventFilterByProperty[], item) => {
        if (item?.propRef && Array.isArray(item.values) && item.values.length) {
          acc.push({
            type: 'property',
            propertyType: item.propRef.type,
            propertyName: item.propRef.name,
            operation: item.opId as PropertyFilterOperation,
            value: item.values,
          })
        }

        return acc
      }, []),
    }

    if (!item.filters?.length) {
      delete item.filters
    }

    if (item.eventName) {
      items.push(item)
    }
    return items
  }, [])
}

export const defaultColumns = [
  'user_id',
  'created_at',
  'event'
]

export const useLiveStreamStore = defineStore('liveStream', {
  state: (): LiveStreamStore => ({
    events: [],
    controlsPeriod: '90',
    period: {
      from: '',
      to: '',
      type: TimeTypeEnum.Last,
      last: 30,
    },
    columns: [],
    activeColumns: defaultColumns.map(key => ({propertyName: key, propertyType: PropertyType.System})),
    loading: false,
    eventPopup: false,
  }),
  getters: {
    isPeriodActive(): boolean {
      return (
        Boolean(this.period.from) && Boolean(this.period.to) && this.controlsPeriod === 'calendar'
      )
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
    isNoData(): boolean {
      return !this.columns.length && !this.loading
    },
  },
  actions: {
    toggleColumns(payload: PropertyRef[]) {
      this.activeColumns = payload;
    },
    async getReportLiveStream() {
      this.loading = true
      const projectsStore = useProjectsStore()
      const lexiconStore = useLexiconStore()

      const properties = this.activeColumns.filter(property => lexiconStore.properties.find(item => item.propertyName === property.propertyName))

      try {
        const props: EventRecordsListRequest = {
          time: this.timeRequest,
          properties: properties
        }

        if (this.events.length) {
          props.events = getParamsEventsForRequest(this.events)
        }

        const res = await apiClient.eventRecords.eventRecordsList(projectsStore.projectId, props)

        if (Array.isArray(res?.data?.columns)) {
          this.columns = res.data.columns
        }
      } catch (error) {
        throw new Error('error request createEventsStream')
      }
      this.loading = false
    },
  },
})
