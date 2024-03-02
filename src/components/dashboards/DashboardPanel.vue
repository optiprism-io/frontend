<template>
  <div class="dashboard-panel">
    <div class="dashboard-panel__name">
      <router-link v-if="reportLink" :to="reportLink">
        {{ report?.name }}
      </router-link>
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
    <FunnelsChart
      v-else
      :lite-chart="true"
      :reports="funnelsReport"
      :steps="steps"
      :height="funnelsChartHeight"
      :min-width-step="100"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { pagesMap } from '@/router'
import {
  Report,
  DataTableResponse,
  ReportType,
  DataTableResponseColumnsInner,
  FunnelQuery,
  EventSegmentation as EventSegmentationType,
  EventRecordsListRequestTime,
} from '@/api'

import reportsService from '@/api/services/reports.service'
import { ChartType } from '@/stores/eventSegmentation/events'

import { useReportsStore } from '@/stores/reports/reports'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useProjectsStore } from '@/stores/projects/projects'

import dataService from '@/api/services/datas.service'
import { Step } from '@/types/steps'
import { mapReportToSteps } from '@/utils/reportsMappings'

import EventsViews from '@/components/events/EventsViews.vue'
import FunnelsChart from '@/components/funnels/view/FunnelsChart.vue'

const reportsStore = useReportsStore()
const filterGroupsStore = useFilterGroupsStore()
const eventsStore = useEventsStore()
const projectsStore = useProjectsStore()

const props = defineProps<{
  report?: Report
  reportId?: number
  heightChart?: number
}>()

const loading = ref(false)
const eventSegmentation = ref<DataTableResponse>()
const funnelsReport = ref<DataTableResponseColumnsInner[]>()
const steps = ref<Step[]>()
const filterTimeInitState = ref<EventRecordsListRequestTime | null>(null)

const filterTime = computed(() => eventsStore.timeRequest)
const activeReport = computed(() => reportsStore.list.find(item => item.id === props.reportId))
const funnelsChartHeight = computed(() => (props.heightChart ? props.heightChart - 40 : 190))
const report = computed(() => props.report || activeReport.value)
const query = computed(() => report.value?.query)
const reportChartType = computed(() => (report.value?.query?.chartType as ChartType) ?? 'line')
const reportType = computed(() => report.value?.type ?? ReportType.EventSegmentation)
const isEventsViews = computed(() => reportType.value === ReportType.EventSegmentation)

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
        query.filters = filterGroupsStore.filters
      }
      if (ifChangeAnyInFilterTime.value) {
        query.time = filterTime.value
      }
      if (query.events.length) {
        const res = await reportsService.eventSegmentation(projectsStore.projectId, query)
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
      const res = await dataService.funnelQuery(projectsStore.projectId, query)

      if (res?.data?.columns) {
        funnelsReport.value = res.data.columns as DataTableResponseColumnsInner[]
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
};

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

<style lang="scss">
.dashboard-panel {
  margin-top: -24px;
  overflow: hidden;
  height: calc(100% + 24px);
  &__name {
    font-size: 16px;
  }
  .chart-wrapper__container {
    height: 100%;
  }
}
</style>
