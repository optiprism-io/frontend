import { defineStore } from 'pinia'
import reportsService from '@/api/services/reports.service'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useFunnelsStore } from '@/stores/funnels/funnels'
import { useStepsStore } from '@/stores/funnels/steps'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useSegmentsStore } from '@/stores/reports/segments'
import { useProjectsStore } from '@/stores/projects/projects'

import {
  Report,
  ReportQuery,
  ReportType,
  EventRecordsListRequestTime,
  EventChartType,
  FunnelStepsChartTypeTypeEnum,
  TimeUnit,
  EventGroupedFilters,
  BreakdownByProperty,
  EventSegmentationSegment,
  FunnelQueryStepsInner,
  PropertyRef,
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

export const getReport = (type: ReportType) => {
  const eventsStore = useEventsStore()
  const funnelsStore = useFunnelsStore()
  const breakdownsStore = useBreakdownsStore()
  const filterGroupsStore = useFilterGroupsStore()
  const segmentsStore = useSegmentsStore()
  const stepsStore = useStepsStore()

  const report = {
    time:
      type === ReportType.EventSegmentation
        ? (eventsStore.timeRequest as EventRecordsListRequestTime)
        : (funnelsStore.timeRequest as EventRecordsListRequestTime),
    group: eventsStore.group,
    intervalUnit: eventsStore.controlsGroupBy,
    chartType:
      type === ReportType.EventSegmentation
        ? (eventsStore.chartType as EventChartType)
        : {
            type: FunnelStepsChartTypeTypeEnum.Steps,
            intervalUnit: TimeUnit.Day,
          },
    analysis: { type: 'linear' },
    events:
      type === ReportType.EventSegmentation
        ? eventsStore?.propsForEventSegmentationResult?.events || []
        : [],
    steps: stepsStore.getSteps as FunnelQueryStepsInner[],
    holdingConstants: stepsStore.getHoldingProperties as PropertyRef[],
    exclude: stepsStore.getExcluded,
  } as ReportQuery

  if (filterGroupsStore.isSelectedAnyFilter) {
    report.filters = filterGroupsStore.filters
  }

  if (breakdownsStore.isSelectedAnyBreakdown) {
    report.breakdowns = breakdownsStore.breakdownsItems as BreakdownByProperty[]
  }

  if (segmentsStore.isSelectedAnySegments) {
    report.segments = segmentsStore.segmentationItems as EventSegmentationSegment[]
  }
  return report
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
        const res = await reportsService.reportsList(projectsStore.projectId)
        if (res.data?.data) {
          this.list = res.data.data
        }
      } catch (e) {
        console.log('error reportsList')
      }
    },
    async createReport(name: string, type: ReportType) {
      this.saveLoading = true
      const projectsStore = useProjectsStore()
      try {
        const res = await reportsService.createReport(projectsStore.projectId, {
          type,
          name,
          query: getReport(type),
        })
        if (res.data?.id) {
          this.reportId = Number(res.data.id)
        }
      } catch (e) {
        console.log('error reportsList')
      }

      this.saveLoading = false
    },
    async editReport(name: string, type: ReportType) {
      this.saveLoading = true
      const projectsStore = useProjectsStore()
      await reportsService.updateReport(projectsStore.projectId, Number(this.reportId), {
        name,
        query: getReport(type),
      })
      this.saveLoading = false
    },
    async deleteReport(reportId: number) {
      const projectsStore = useProjectsStore()
      await reportsService.deleteReport(projectsStore.projectId, Number(reportId))
    },
  },
})
