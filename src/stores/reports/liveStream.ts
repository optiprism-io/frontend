import { defineStore } from 'pinia'
import {
  DataTableResponseColumnsInner,
  EventFilterByProperty,
  EventRecordRequestEvent,
  EventRecordsListRequest,
  EventRecordsListRequestTime,
  EventType,
  PropertyFilterOperation,
  PropertyType,
  PropertyRef as PropertyRefApi
} from '@/api'
import { Event } from '@/stores/eventSegmentation/events'
import { useProjectsStore } from '@/stores/projects/projects'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { useLexiconStore } from '../lexicon'
import { apiClient } from '@/api/apiClient'
import { PropertyRef } from '@/types/events'

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

const getParamsEventsForRequest = (events: Event[]): EventRecordRequestEvent[] => {
  return events.reduce((items: EventRecordRequestEvent[], event) => {
    const item: EventRecordRequestEvent = {
      eventName: event.ref.name,
      eventType: event.ref.type as EventType,
      filters: event.filters.reduce((acc: EventFilterByProperty[], item) => {
        if (item?.propRef && Array.isArray(item.values) && item.values.length) {
          const property: EventFilterByProperty = {
            type: 'property',
            propertyType: item.propRef.type,
            propertyName: item.propRef.name,
            operation: item.opId as PropertyFilterOperation,
            value: item.values,
          }

          if (item.propRef?.group) {
            property.group = item.propRef?.group
          }

          acc.push(property)
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

export const defaultColumns = ['user_id', 'created_at', 'event']

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
  group: number
}

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
    activeColumns: defaultColumns.map(key => ({
      name: key,
      type: PropertyType.System,
    })),
    loading: false,
    eventPopup: false,
    group: 0,
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
      this.activeColumns = payload
    },
    async getReportLiveStream() {
      this.loading = true
      const projectsStore = useProjectsStore()

      const properties = this.activeColumns.filter(item => item.name !== 'user_id').map(item => {
        const property: PropertyRefApi = {
          propertyName: item.name,
          propertyType: item.type,
        }

        if (item.group) {
          property.group = item.group
        }

        return property
      })

      try {
        const props: EventRecordsListRequest = {
          time: this.timeRequest,
          properties: properties,
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
