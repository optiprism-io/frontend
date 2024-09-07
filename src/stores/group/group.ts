import { defineStore } from 'pinia'

import { apiClient } from '@/api/apiClient'
import { getRequestTime, TimeTypeEnum } from '@/helpers/periodHelper'
import { useProjectsStore } from '@/stores/projects/projects'

import type { EventRecordsListRequestTime, GroupRecord, Value } from '@/api'

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
    type: TimeTypeEnum
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
      type: TimeTypeEnum.Last,
      last: 30,
    },
    propertyPopup: false,
  }),
  actions: {
    async getList(noLoading?: boolean) {
      if (!noLoading) {
        this.loading = true
      }
      const projectsStore = useProjectsStore()
      try {
        // TODO integrate Group Page
        const res = await apiClient.groupRecords.groupRecordsList(projectsStore.projectId, {
          time: this.timeRequest,
          group: 0,
        })
        if (res?.data?.data) {
          this.items = res.data.data
        }
      } catch (e) {
        console.error('error update event property')
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
        await apiClient.groupRecords.updateGroupRecord(projectsStore.projectId, payload.id, {
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
      return getRequestTime(
        this.period.type,
        this.controlsPeriod,
        this.period.from,
        this.period.to,
        this.period.last
      )
    },
    isNoData(): boolean {
      return !this.items.length && !this.loading
    },
  },
})
