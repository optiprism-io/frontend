import { defineStore } from 'pinia'
import {
  EventFilterByProperty,
  EventRecordRequestEvent,
  EventType,
  PropertyFilterOperation,
  EventRecordsListRequest,
  DataTableResponseColumnsInner,
  EventRecordsListRequestTime,
} from '@/api'
import { Event } from '@/stores/eventSegmentation/events'
import dataService from '@/api/services/datas.service'
import { useProjectsStore } from '@/stores/projects/projects'
import { usePeriod } from '@/hooks/usePeriod'

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

type LiveStream = {
  events: Event[]
  controlsPeriod: string
  period: {
    from: string
    to: string
    last: number
    type: string
  }
  columns: Array<DataTableResponseColumnsInner>
  activeColumns: string[]
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

export const useLiveStreamStore = defineStore('liveStream', {
  state: (): LiveStream => ({
    events: [],
    controlsPeriod: '90',
    period: {
      from: '',
      to: '',
      type: 'last',
      last: 30,
    },
    columns: [],
    activeColumns: [],
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
    toggleColumns(key: string) {
      if (this.activeColumns.includes(key)) {
        this.activeColumns = this.activeColumns.filter(item => item !== key)
      } else {
        this.activeColumns.push(key)
      }
    },
    async getReportLiveStream() {
      this.loading = true
      const projectsStore = useProjectsStore()
      try {
        const props: EventRecordsListRequest = {
          time: this.timeRequest,
        }

        if (this.events.length) {
          props.events = getParamsEventsForRequest(this.events)
        }

        const res = await dataService.createEventsStream(projectsStore.projectId, props)

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
