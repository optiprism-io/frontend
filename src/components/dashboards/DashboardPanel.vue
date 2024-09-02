<template>
  <div class="dashboard-panel">
    <div class="dashboard-panel__name">
      <RouterLink
        v-if="reportLink"
        :to="reportLink"
      >
        {{ report?.name }}
      </RouterLink>
    </div>
    <EventsViews
      v-if="isEventsViews"
      :event-segmentation="eventSegmentation"
      :loading="loading"
      :chart-type="reportChartType"
      :only-view="true"
      :lite-chart="true"
      :height-chart="props.heightChart || 240"
    />
    <ChartStacked
      v-else-if="reportSteps.length"
      :data="normalizedReportSteps"
      :height="(props.heightChart || 240) + 'px'"
      :lite-chart="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import { RouterLink } from 'vue-router'

import ChartStacked from '@/components/charts/ChartStacked.vue'
import EventsViews from '@/components/events/EventsViews.vue'

import {
  EventGroupedFiltersGroupsConditionEnum,
  EventSegmentationQueryFormatEnum,
  ReportType,
} from '@/api'
import { apiClient } from '@/api/apiClient'
import { type ChartStackedItem } from '@/components/charts/types'
import { DEFAULT_SEPARATOR } from '@/constants'
import { pagesMap } from '@/router'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useProjectsStore } from '@/stores/projects/projects'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useReportsStore } from '@/stores/reports/reports'
import { mapReportToSteps } from '@/utils/reportsMappings'

import type {
  DataTableResponse,
  EventGroupedFiltersGroupsInnerFiltersInner,
  EventRecordsListRequestTime,
  EventSegmentation as EventSegmentationType,
  FunnelQuery,
  FunnelResponseStepsInner,
  Report,
} from '@/api'
import type { ChartType } from '@/stores/eventSegmentation/events'
import type { Step } from '@/types/steps'

const props = defineProps<{
  report?: Report
  reportId?: number
  heightChart?: number
}>()

const reportsStore = useReportsStore()
const filterGroupsStore = useFilterGroupsStore()
const eventsStore = useEventsStore()
const projectsStore = useProjectsStore()

const loading = ref(false)
const eventSegmentation = ref<DataTableResponse>()
const reportSteps = ref<FunnelResponseStepsInner[]>([])
const steps = ref<Step[]>()
const filterTimeInitState = ref<EventRecordsListRequestTime | null>(null)

const filterTime = computed(() => eventsStore.timeRequest)
const activeReport = computed(() => reportsStore.list.find(item => item.id === props.reportId))
const report = computed(() => props.report || activeReport.value)
const query = computed(() => report.value?.query)
const reportChartType = computed(() => (report.value?.query?.chartType as ChartType) ?? 'line')
const reportType = computed(() => report.value?.type ?? ReportType.EventSegmentation)
const isEventsViews = computed(() => reportType.value === ReportType.EventSegmentation)

const normalizedReportSteps = computed<ChartStackedItem[]>(() =>
  reportSteps.value.map(step => {
    return {
      groupName: step.step,
      elements: step.data.map(item => ({
        columnName: item.groups.join(DEFAULT_SEPARATOR),
        primary: {
          value: item.total,
          percentage: item.conversionRatio,
          label: 'Total',
          percentageLabel: 'Conversion Ratio',
        },
        secondary: {
          value: item.droppedOff,
          percentage: item.dropOffRatio,
          label: 'Dropped Off',
          percentageLabel: 'Dropped Off Ratio',
        },
      })),
    }
  }))

const reportLink = computed(() => {
  if (report.value) {
    return {
      name:
        report.value?.type === ReportType.EventSegmentation
          ? pagesMap.reportsEventSegmentation.name
          : pagesMap.funnels.name,
      params: {
        id: report.value?.id,
      },
    }
  }
  return null
})

const ifChangeAnyInFilterTime = computed(() => {
  return JSON.stringify(filterTimeInitState.value) !== JSON.stringify(eventsStore.timeRequest)
})

const getEventSegmentation = async () => {
  loading.value = true
  if (report.value?.query) {
    try {
      const query = report.value.query as EventSegmentationType

      if (filterGroupsStore.isSelectedAnyFilter) {
        const filters = filterGroupsStore.filters.groups[0].filters.reduce(
          (acc: EventGroupedFiltersGroupsInnerFiltersInner[], filter) => {
            if ('value' in filter && filter.value?.length) {
              acc.push(filter)
            }

            return acc
          },
          []
        )

        if (filters.length) {
          query.filters = {
            groupsCondition: EventGroupedFiltersGroupsConditionEnum.And,
            groups: [
              {
                filtersCondition: EventGroupedFiltersGroupsConditionEnum.And,
                filters,
              },
            ],
          }
        }
        query.time = filterTime.value
      }
      if (query.events.length) {
        const res = await apiClient.query.eventSegmentationQuery(
          projectsStore.projectId,
          EventSegmentationQueryFormatEnum.Json,
          query
        )
        if (res) {
          eventSegmentation.value = res.data as DataTableResponse
        }
      }
    } catch (error) {
      throw Error(JSON.stringify(error))
    }
  }
  loading.value = false
}

const getFunnelsReport = async () => {
  loading.value = true
  if (query.value) {
    try {
      const query = report.value?.query as FunnelQuery
      if (filterGroupsStore.isSelectedAnyFilter) {
        query.filters = filterGroupsStore.filters
      }
      if (ifChangeAnyInFilterTime.value) {
        query.time = filterTime.value
      }
      const res = await apiClient.query.funnelQuery(projectsStore.projectId, query)

      if (res?.data?.steps) {
        reportSteps.value = res.data.steps
      }
    } catch (error) {
      throw Error(JSON.stringify(error))
    }
  }
  loading.value = false
}

const updateState = async () => {
  if (reportType.value === ReportType.EventSegmentation) {
    getEventSegmentation()
  } else if (reportType.value === ReportType.Funnel) {
    getFunnelsReport()
    const query = report.value?.query as FunnelQuery
    if (query.steps) {
      steps.value = await mapReportToSteps(query.steps)
    }
  }
}

onMounted(() => {
  filterTimeInitState.value = eventsStore.timeRequest

  updateState()
})

watch(
  () => props.reportId,
  (id, oldValue) => {
    if (id && id !== oldValue) {
      updateState()
    }
  }
)

const onChange = () => {
  updateState()
}

filterGroupsStore.$subscribe(mutation => {
  if (mutation.type === 'direct') {
    onChange()
  }
})

eventsStore.$subscribe(mutation => {
  if (mutation.type === 'direct') {
    onChange()
  }
})
</script>

<style lang="scss" scoped>
.dashboard-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  height: 100%;
}

.dashboard-panel__name {
  font-size: 16px;
}
</style>
