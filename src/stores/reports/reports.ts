import { defineStore } from 'pinia'

import { FunnelQueryCountEnum, FunnelStepsChartTypeTypeEnum, ReportType, TimeUnit } from '@/api'
import { apiClient } from '@/api/apiClient'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useStepsStore } from '@/stores/funnels/steps'
import { useProjectsStore } from '@/stores/projects/projects'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useSegmentsStore } from '@/stores/reports/segments'

import type { EventChartType, Report, EventSegmentation, FunnelQuery, ReportQuery ,
} from '@/api'

type Reports = {
  list: Report[]
  loading: boolean
  saveLoading: boolean
  reportId: number | null
  reportDump: string
  reportDumpType: ReportType
  updateToEmpty: boolean
}

const getReport = (type: ReportType): ReportQuery => {
  /* TODO: fix multiple links with other stores  */
  const eventsStore = useEventsStore()
  const breakdownsStore = useBreakdownsStore()
  const filterGroupsStore = useFilterGroupsStore()
  const segmentsStore = useSegmentsStore()
  const stepsStore = useStepsStore()

  const filters = filterGroupsStore.isSelectedAnyFilter ? filterGroupsStore.filters : undefined
  const breakdowns = breakdownsStore.isSelectedAnyBreakdown
    ? breakdownsStore.breakdownsItems
    : undefined
  const segments = segmentsStore.isSelectedAnySegments ? segmentsStore.segmentationItems : undefined

  if (type === ReportType.EventSegmentation) {
    const events = eventsStore?.propsForEventSegmentationResult?.events || []
    const chartType = eventsStore.chartType as EventChartType

    /* TODO: fix "as EventSegmentation" -> "satisfies EventSegmentation" */
    return {
      type,
      time: eventsStore.timeRequest,
      group: eventsStore.group,
      intervalUnit: eventsStore.controlsGroupBy,
      chartType,
      analysis: { type: 'linear' },
      events,
      filters,
      breakdowns,
      segments,
    } as EventSegmentation
  } else {
    const chartType = {
      type: FunnelStepsChartTypeTypeEnum.Steps,
      intervalUnit: TimeUnit.Day,
    }

    /* TODO: fix "as FunnelQuery" -> "satisfies FunnelQuery" */
    return {
      type,
      time: eventsStore.timeRequest,
      group: eventsStore.group,
      steps: stepsStore.getSteps,
      timeWindow: {
        n: stepsStore.size,
        unit: stepsStore.unit,
      },
      chartType,
      count: FunnelQueryCountEnum.NonUnique,
      holdingConstants: stepsStore.getHoldingProperties,
      exclude: stepsStore.getExcluded,
      filters,
      breakdowns,
      segments,
      touch: {
        type: 'first'
      }
    } as FunnelQuery
  }
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
    isChangedReport(): boolean {
      return !this.reportId || JSON.stringify(getReport(this.reportDumpType)) !== this.reportDump
    },
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
    updateDump(type: ReportType) {
      this.reportDumpType = type
      this.reportDump = JSON.stringify(getReport(type))
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
    async createReport(name: string, type: ReportType) {
      this.saveLoading = true
      const projectsStore = useProjectsStore()
      try {
        const res = await apiClient.reports.createReport(projectsStore.projectId, {
          type,
          name,
          query: getReport(type),
        })
        if (res.data?.id) {
          this.reportId = Number(res.data.id)
        }
      } catch (e) {
        console.error('error reportsList')
      }

      this.saveLoading = false
    },
    async editReport(name: string, type: ReportType) {
      this.saveLoading = true
      const projectsStore = useProjectsStore()
      await apiClient.reports.updateReport(projectsStore.projectId, Number(this.reportId), {
        name,
        query: getReport(type),
      })
      this.saveLoading = false
    },
    async deleteReport(reportId: number) {
      const projectsStore = useProjectsStore()
      await apiClient.reports.deleteReport(projectsStore.projectId, Number(reportId))
    },
  },
})
