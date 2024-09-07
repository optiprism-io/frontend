import { defineStore } from 'pinia'

import { ReportType } from '@/api'
import { apiClient } from '@/api/apiClient'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Report, ReportQuery } from '@/api'

type Reports = {
  list: Report[]
  loading: boolean
  saveLoading: boolean
  reportId: number | null
  reportDump: string
  reportDumpType: ReportType
  updateToEmpty: boolean
}

export const useReportsStore = defineStore('reports', {
  state: (): Reports => ({
    list: [],
    loading: true,
    reportId: null,
    saveLoading: false,
    reportDump: '',
    reportDumpType: ReportType.EventSegmentation,
    updateToEmpty: false,
  }),
  getters: {
    activeReport(): null | Report {
      const report = this.list.find(item => item.id && Number(item.id) === Number(this.reportId))
      return report ?? null
    },
    reportsId(): number[] {
      return this.list.map(item => Number(item.id))
    },
  },
  actions: {
    emptyReport() {
      this.reportId = null
      this.updateToEmpty = true
    },
    async getList() {
      const projectsStore = useProjectsStore()
      try {
        const res = await apiClient.reports.reportsList(projectsStore.projectId)
        if (res.data?.data) {
          this.list = res.data.data
        }
      } catch (e) {
        console.error('error reportsList')
      }
    },
    async createReport(name: string, type: ReportType, query: ReportQuery) {
      this.saveLoading = true
      const projectsStore = useProjectsStore()
      try {
        const res = await apiClient.reports.createReport(projectsStore.projectId, {
          name,
          type,
          query,
        })
        if (res.data?.id) {
          this.reportId = Number(res.data.id)
        }
      } catch (e) {
        console.error('error reportsList')
      } finally {
        this.saveLoading = false
      }
    },
    async editReport(name: string, type: ReportType, query: ReportQuery) {
      this.saveLoading = true
      const projectsStore = useProjectsStore()
      await apiClient.reports.updateReport(projectsStore.projectId, Number(this.reportId), {
        name,
        query,
      })
      this.saveLoading = false
    },
    async deleteReport(reportId: number) {
      const projectsStore = useProjectsStore()
      await apiClient.reports.deleteReport(projectsStore.projectId, Number(reportId))
    },
  },
})
