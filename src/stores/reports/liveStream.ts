import { defineStore } from 'pinia'
import {
  EventFilterByProperty,
  EventRecordRequestEvent,
  EventType,
  TimeBetween,
  TimeFrom,
  TimeLast,
  PropertyFilterOperation,
} from '@/api'
import { Event } from '@/stores/eventSegmentation/events'
import dataService from '@/api/services/datas.service'
import { useProjectsStore } from '@/stores/projects/projects'

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
  reports: Array<Report | object> | any
  activeColumns: string[]
  defaultColumns: string[]
  loading: boolean
  eventPopup: boolean
}

const getParamsEventsForRequest = (events: Event[]): EventRecordRequestEvent[] => {
  return events.map(event => {
    return {
      eventName: event.ref.name,
      eventType: event.ref.type as EventType,
      filters: event.filters.reduce((acc: EventFilterByProperty[], item) => {
        if (item?.propRef) {
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
  })
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
    reports: [],
    activeColumns: [],
    defaultColumns: ['eventName', 'customEvents', 'createdAt'],
    loading: false,
    eventPopup: false,
  }),
  getters: {
    isPeriodActive(): boolean {
      return (
        Boolean(this.period.from) && Boolean(this.period.to) && this.controlsPeriod === 'calendar'
      )
    },
    timeRequest(): TimeBetween | TimeFrom | TimeLast {
      switch (this.period.type) {
        case 'last':
          return {
            type: this.period.type,
            last: this.period.last,
            unit: 'day',
          }
        case 'since':
          return {
            type: 'from',
            from: this.period.from,
          }
        case 'between':
          return {
            type: this.period.type,
            from: this.period.from,
            to: this.period.to,
          }
        default:
          return {
            type: 'last',
            last: Number(this.controlsPeriod),
            unit: 'day',
          }
      }
    },
    columnsMapObject() {
      const properties: string[] = []
      const userProperties: string[] = []

      this.reports.forEach((item: Report) => {
        Object.keys(item.properties).forEach((key: string) => {
          if (key !== 'createdAt') {
            properties.push(key)
          }
        })
        if (item.userProperties) {
          Object.keys(item.userProperties).forEach((key: string) => {
            userProperties.push(key)
          })
        }
      })

      return {
        properties: [...new Set(properties)],
        userProperties: [...new Set(userProperties)],
      }
    },
    columnsMap(): string[] {
      const items: string[] = []

      this.reports.forEach((item: Report) => {
        Object.keys(item.properties).forEach((key: string) => {
          if (key !== 'createdAt') {
            items.push(key)
          }
        })
        if (item.userProperties) {
          Object.keys(item.userProperties).forEach((key: string) => {
            items.push(key)
          })
        }
      })

      return [...new Set(items)]
    },
    isNoData(): boolean {
      return !this.reports.length && !this.loading
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
        const res = await dataService.createEventsStream(projectsStore.projectId, {
          time: this.timeRequest,
          events: getParamsEventsForRequest(this.events),
        })
        if (Array.isArray(res?.data)) {
          this.reports = res.data

          if (this.columnsMap) {
            this.activeColumns = this.columnsMap
          }
        }
      } catch (error) {
        throw new Error('error request createEventsStream')
      }
      this.loading = false
    },
  },
})
