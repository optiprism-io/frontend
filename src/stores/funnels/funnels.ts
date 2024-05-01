import { defineStore } from 'pinia'
import { getLastNDaysRange } from '@/helpers/calendarHelper'
import { getYYYYMMDD } from '@/helpers/getStringDates'
import {
  DataTableResponseColumnsInner,
  EventRecordsListRequestTime,
  FunnelStepsChartTypeTypeEnum,
  TimeUnit,
  FunnelQueryCountEnum,
} from '@/api'
import { useStepsStore } from '@/stores/funnels/steps'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useSegmentsStore } from '@/stores/reports/segments'
import { useProjectsStore } from '@/stores/projects/projects'
import { usePeriod, TimeTypeEnum } from '@/hooks/usePeriod'
import { apiClient } from '@/api/apiClient'

export const convertColumns = (
  columns: DataTableResponseColumnsInner[],
  stepNumbers: number[]
): number[][] => {
  const result: number[][] = []

  for (let i = 0; i < stepNumbers.length; i++) {
    const column = columns.find(col => col.step === stepNumbers[i])
    if (column) {
      result.push(column.data as number[])
    } else {
      result.push([])
    }
  }

  return result
}

type FunnelsStore = {
  controlsPeriod: string | number
  period: {
    from: string
    to: string
    last: number
    type: TimeTypeEnum
  }
  reports: DataTableResponseColumnsInner[]
  loading: boolean
}

export const useFunnelsStore = defineStore('funnels', {
  state: (): FunnelsStore => ({
    controlsPeriod: '30',
    period: {
      from: '',
      to: '',
      type: TimeTypeEnum.Last,
      last: 30,
    },
    reports: [],
    loading: false,
  }),
  getters: {
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
    stepNumbers(): number[] {
      const metricValueColumns = this.reports.filter(col => col.type === 'metric')
      const stepNumbers = metricValueColumns.map(col => col.step) as number[]
      return [...new Set(stepNumbers)]
    },
    dimensions(): string[] {
      const result: string[] = []
      const columns = this.reports.filter(col => col.type === 'dimension')

      for (let i = 0; i < (columns[0]?.data?.length ?? 0); i++) {
        const row: string[] = []
        columns.forEach(item => {
          row.push(`${item.data?.[i] ?? ''}`)
        })
        result.push(row.join(' / '))
      }

      return result
    },
    conversionCount(): number[][] {
      const columns = this.reports.filter(col => col.name === 'conversionCount')
      return convertColumns(columns, this.stepNumbers)
    },
    conversionRatio(): number[][] {
      const columns = this.reports.filter(col => col.name === 'conversionRatio')
      return convertColumns(columns, this.stepNumbers)
    },
    dropOffCount(): number[][] {
      const columns = this.reports.filter(col => col.name === 'dropOffCount')
      return convertColumns(columns, this.stepNumbers)
    },
    dropOffRatio(): number[][] {
      const columns = this.reports.filter(col => col.name === 'dropOffRatio')
      return convertColumns(columns, this.stepNumbers)
    },
  },
  actions: {
    setControlsPeriod(payload: string) {
      this.controlsPeriod = payload
    },
    setPeriod(payload: { from: string; to: string; type: TimeTypeEnum; last: number }) {
      this.period = payload
    },
    initPeriod(): void {
      const lastNDateRange = getLastNDaysRange(20)
      this.period = {
        from: getYYYYMMDD(lastNDateRange.from),
        to: getYYYYMMDD(new Date()),
        type: 'last',
        last: 20,
      }
    },
    async getReports(): Promise<void> {
      const projectsStore = useProjectsStore()
      const stepsStore = useStepsStore()
      const breakdownsStore = useBreakdownsStore()
      const filterGroupsStore = useFilterGroupsStore()
      const segmentsStore = useSegmentsStore()

      this.loading = true

      try {
        const res = await apiClient.query.funnelQuery(projectsStore.projectId, {
          time: this.timeRequest as EventRecordsListRequestTime,
          group: '',
          steps: stepsStore.getSteps,
          timeWindow: {
            n: stepsStore.size,
            unit: stepsStore.unit,
          },
          chartType: {
            type: FunnelStepsChartTypeTypeEnum.Steps,
            /* TODO: fix typescript error */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Unreachable code error
            intervalUnit: TimeUnit.Day,
          },
          count: FunnelQueryCountEnum.Unique,
          holdingConstants: stepsStore.getHoldingProperties,
          exclude: stepsStore.getExcluded,
          breakdowns: breakdownsStore.breakdownsItems,
          segments: segmentsStore.segmentationItems,
          filters: filterGroupsStore.filters,
        })

        /* TODO: fix typescript error in funnel query branch */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Unreachable code error
        if (res?.data?.columns) {
          /* TODO: fix typescript error in funnel query branch */
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          this.reports = res.data.columns
        }
      } catch (e) {
        console.log('Error while getting funnel reports')
      } finally {
        this.loading = false
      }
    },
  },
})
