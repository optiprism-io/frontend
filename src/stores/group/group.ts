import { defineStore } from 'pinia'
import { GroupRecord, EventRecordsListRequestTime, Value } from '@/api'
import { groupRecordsService } from '@/api/services/groupRecords.service'
import { useSegmentsStore } from '@/stores/reports/segments'
import { useProjectsStore } from '@/stores/projects/projects'

export type GroupMap = {
  [key: number]: GroupRecord
}

export type Group = {
  items: GroupRecord[]
  loading: boolean
  loadingOne: boolean
  controlsPeriod: string | number
  propertyPopup: boolean
  period: {
    from: string
    to: string
    last: number
    type: string
  }
}

export const useGroupStore = defineStore('group', {
  state: (): Group => ({
    items: [],
    loading: false,
    loadingOne: false,
    controlsPeriod: '30',
    period: {
      from: '',
      to: '',
      type: 'last',
      last: 30,
    },
    propertyPopup: false,
  }),
  actions: {
    async getList(noLoading?: boolean) {
      if (!noLoading) {
        this.loading = true
      }
      const segmentsStore = useSegmentsStore()
      const projectsStore = useProjectsStore()
      try {
        const res = await groupRecordsService.getList(projectsStore.projectId, {
          time: this.timeRequest,
          group: 'users', // TODO any group to use
          segments: segmentsStore.segmentationItems,
        })
        if (res?.data?.data) {
          this.items = res.data.data
        }
      } catch (e) {
        console.log('error update event property')
      }
      if (!noLoading) {
        this.loading = false
      }
    },
    async update(payload: {
      id: number
      properties: { [key: string]: Value }
      noLoading?: boolean
    }) {
      const projectsStore = useProjectsStore()
      if (!payload.noLoading) {
        this.loading = true
      }
      try {
        await groupRecordsService.updated(projectsStore.projectId, payload.id, {
          properties: payload.properties,
        })
        await this.getList(payload.noLoading || true)
      } catch (e) {
        if (!payload.noLoading) {
          this.loading = false
        }
        console.error('error update event property')
      }
    },
  },
  getters: {
    isPeriodActive(): boolean {
      return (
        Boolean(this.period.from) && Boolean(this.period.to) && this.controlsPeriod === 'calendar'
      )
    },
    timeRequest(): EventRecordsListRequestTime {
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
    isNoData(): boolean {
      return !this.items.length && !this.loading
    },
  },
})
