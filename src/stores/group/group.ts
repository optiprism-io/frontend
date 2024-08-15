import { defineStore } from 'pinia'

import { apiClient } from '@/api/apiClient'
import { TimeTypeEnum, usePeriod } from '@/hooks/usePeriod'
import { useProjectsStore } from '@/stores/projects/projects'

import type { DataTableResponseColumnsInner, EventRecordsListRequestTime, GroupRecord, Value } from '@/api'

export type Group = {
  items: Array<GroupRecord>
  columns: Array<DataTableResponseColumnsInner>,
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
    columns: [],
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
      const projectsStore = useProjectsStore()

      if (!noLoading) {
        this.loading = true
      }

      try {
        const res = await apiClient.groupRecords.groupRecordsList(projectsStore.projectId, {
          time: this.timeRequest,
          group: 0,
        })
        this.columns = res?.data?.columns || []
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
      return !this.items.length && !this.loading
    },
  },
})
