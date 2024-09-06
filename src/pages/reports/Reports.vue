<template>
  <section class="reports pf-u-py-0">
    <div class="pf-l-flex pf-m-column pf-u-pt-md pf-u-w-100 pf-u-h-100">
      <div class="pf-l-flex__item">
        <div class="pf-u-display-flex pf-u-align-items-center">
          <UiSelect
            v-if="!editableNameReport && itemsReports.length"
            class="reports__select pf-u-mr-md"
            :items="itemsReports"
            :text-button="reportSelectText"
            :is-text-select="true"
            :selections="[Number(reportsStore.reportId)]"
            :is-toggle="false"
            :w-100="true"
            @on-select="onSelectReport"
          >
            <template
              v-if="reportsStore.loading"
              #action
            >
              <UiSpinner />
            </template>
          </UiSelect>
          <UiInlineEdit
            v-if="reportsStore.reportId"
            class="reports__name pf-u-mr-md"
            :value="reportName"
            :hide-text="true"
            :hide-control-edit="!itemsReports.length"
            @on-input="setNameReport"
            @on-edit="onEditNameReport"
          />
          <UiButton
            class="pf-m-link reports__nav-item reports__nav-item_new"
            before-icon="fas fa-floppy-disk"
            @click="onSaveReport"
          >
            {{ $t('reports.save') }}
          </UiButton>
          <UiButton
            v-if="itemsReports.length && reportsStore.reportId"
            class="pf-m-link pf-m-danger"
            before-icon="fas fa-times"
            @click="togglePopup(true)"
          >
            {{ $t('reports.delete') }}
          </UiButton>
          <UiSwitch
            v-if="showSyncReports"
            class="pf-u-ml-auto pf-u-mr-md"
            :value="commonStore.syncReports"
            :label="$t('reports.sync')"
            @input="(value: boolean) => (commonStore.syncReports = value)"
          />
        </div>
      </div>
      <div class="pf-l-flex__item">
        <UiTabs
          class="pf-u-w-100"
          :items="items"
          @on-select="onSelectTab"
        />
      </div>
      <div
        class="pf-l-flex__item pf-u-flex-1 pf-u-w-100 pf-u-min-height"
        style="--pf-u-min-height--MinHeight: 0"
      >
        <RouterView
          :funnel-view="funnelViewId"
          :time-interval="timeInterval"
          @change-view="onChangeView"
          @select-time-interval="selectTimeInterval"
        />
      </div>
    </div>

    <UiPopupWindow
      v-if="visiblePopup"
      :title="$t('reports.delete')"
      :apply-button="$t('common.apply')"
      :cancel-button="$t('common.cancel')"
      apply-button-class="pf-m-danger"
      @cancel="togglePopup(false)"
      @apply="onDeleteReport"
    >
      {{ t('reports.deleteConfirm') }}: <b> {{ reportsStore.activeReport?.name }} </b>?
    </UiPopupWindow>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

import { useToggle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { RouterView, useRoute, useRouter } from 'vue-router'

import UiButton from '@/components/uikit/UiButton.vue'
import UiInlineEdit from '@/components/uikit/UiInlineEdit.vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiSwitch from '@/components/uikit/UiSwitch.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'

import {
  type EventSegmentation,
  FunnelConversionOverTimeChartTypeTypeEnum,
  type FunnelQuery,
  FunnelQueryCountEnum,
  FunnelStepsChartTypeTypeEnum,
  type ReportQuery,
  ReportType,
} from '@/api'
import { useFunnelView } from '@/pages/reports/useFunnelView'
import { useTimeInterval } from '@/pages/reports/useTimeInterval'
import { pagesMap } from '@/router'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useStepsStore } from '@/stores/funnels/steps'
import { useLexiconStore } from '@/stores/lexicon'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useReportsStore } from '@/stores/reports/reports'
import { useSegmentsStore } from '@/stores/reports/segments'
import { reportToStores } from '@/utils/reportsMappings'

import { REPORT_TABS } from './tabs'

import type { EventChartType, FunnelConversionOverTimeChartType, FunnelQueryChartType } from '@/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const reportsStore = useReportsStore()
const commonStore = useCommonStore()
const lexiconStore = useLexiconStore()
const breakdownsStore = useBreakdownsStore()
const filterGroupsStore = useFilterGroupsStore()
const segmentsStore = useSegmentsStore()
const stepsStore = useStepsStore()

const editableNameReport = ref(false)
const reportName = ref('')
const showSyncReports = ref(false)

const [visiblePopup, togglePopup] = useToggle()
const { funnelViewId, onChangeView } = useFunnelView()
const { timeInterval, selectTimeInterval } = useTimeInterval()

const items = computed(() =>
  REPORT_TABS.map(item => ({
    ...item,
    active: route.name === item.value,
  }))
)

const reportSelectText = computed(() =>
  reportsStore.activeReport ? reportsStore.activeReport.name : t('reports.selectReport')
)

const reportType = computed(() =>
  pagesMap.reportsEventSegmentation.name === route.name
    ? ReportType.EventSegmentation
    : ReportType.Funnel
)

const itemsReports = computed(() => {
  const CREATE_NEW_REPORT_ITEM = {
    value: 0,
    key: 0,
    nameDisplay: 'Create New Report',
  }

  const existReports = reportsStore.list.map(item => {
    const id = Number(item.id)
    return {
      value: id,
      key: id,
      nameDisplay: item.name || '',
    }
  })

  return [CREATE_NEW_REPORT_ITEM, ...existReports]
})

const untitledReportName = computed(() => {
  let resName = t('reports.untitledReport')
  let n = 0

  while (reportsStore.list.find(nw => nw.name === resName)) {
    n = n + 1
    const suffix = ' #' + n
    resName = t('reports.untitledReport') + suffix
  }

  return resName
})

const onEditNameReport = (payload: boolean) => {
  editableNameReport.value = payload
}

async function onDeleteReport() {
  if (!reportsStore.reportId) throw new Error('Report ID is not defined')

  await reportsStore.deleteReport(reportsStore.reportId)
  reportsStore.reportId = null

  await reportsStore.getList()
  reportsStore.emptyReport()
  togglePopup(false)
}

const onEditReport = async () => {
  const query = getReportQuery(reportType.value)
  await reportsStore.editReport(
    reportName.value || untitledReportName.value,
    reportType.value,
    query
  )
}

const onCreateReport = async () => {
  const query = getReportQuery(reportType.value)
  await reportsStore.createReport(untitledReportName.value, reportType.value, query)

  await router.push({
    params: {
      id: reportsStore.reportId,
    },
    query: route.query,
  })
}

const onUpdateReport = async () => {
  if (reportsStore.reportId) {
    await onEditReport()
  } else {
    await onCreateReport()
  }
}

const onSaveReport = async () => {
  reportsStore.loading = true
  await onUpdateReport()
  await reportsStore.getList()
  reportsStore.loading = false
}

const setNameReport = (payload: string) => {
  reportName.value = payload
  onSaveReport()
}

const onSelectTab = (value: string) => {
  if (value === pagesMap.reportsEventSegmentation.name) {
    reportsStore.emptyReport()
  }
}

const updateReport = async (id: number) => {
  reportsStore.loading = true
  await reportToStores(Number(id))
  reportName.value = reportsStore.activeReport?.name ?? t('reports.untitledReport')
  reportsStore.loading = false
}

const onSelectReport = async (id: number) => {
  await updateReport(id)
  await router.push({
    params: {
      id,
    },
    query: route.query,
  })
}

const initEventsAndProperties = async () => {
  await Promise.all([
    lexiconStore.getEvents(),
    lexiconStore.getEventProperties(),
    await lexiconStore.getGroups(),
    lexiconStore.getGroupProperties(),
  ])
}

const chartTypeComputed = computed<FunnelQueryChartType | EventChartType>(() => {
  if (reportType.value === ReportType.EventSegmentation) {
    return eventsStore.chartType as EventChartType
  }

  if (reportType.value === ReportType.Funnel) {
    if (funnelViewId.value === FunnelStepsChartTypeTypeEnum.Steps) {
      return {
        type: FunnelStepsChartTypeTypeEnum.Steps,
      } satisfies FunnelQueryChartType
    }
    if (funnelViewId.value === FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime) {
      return {
        type: FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime,
        intervalUnit: timeInterval.value,
      } satisfies FunnelConversionOverTimeChartType
    }
    throw new Error('Unknown funnel view')
  }

  throw new Error('Unknown report type')
})

const getReportQuery = (type: ReportType): ReportQuery => {
  const filters = filterGroupsStore.isSelectedAnyFilter ? filterGroupsStore.filters : undefined
  const breakdowns = breakdownsStore.isSelectedAnyBreakdown
    ? breakdownsStore.breakdownsItems
    : undefined
  const segments = segmentsStore.isSelectedAnySegments ? segmentsStore.segmentationItems : undefined

  if (type === ReportType.EventSegmentation) {
    const events = eventsStore?.propsForEventSegmentationResult?.events || []

    /* TODO: fix "as EventSegmentation" -> "satisfies EventSegmentation" */
    return {
      type,
      time: eventsStore.timeRequest,
      group: eventsStore.group,
      intervalUnit: eventsStore.controlsGroupBy,
      chartType: chartTypeComputed.value,
      analysis: { type: 'linear' },
      events,
      filters,
      breakdowns,
      segments,
    } as EventSegmentation
  } else {
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
      chartType: chartTypeComputed.value,
      count: FunnelQueryCountEnum.NonUnique,
      holdingConstants: stepsStore.getHoldingProperties,
      exclude: stepsStore.getExcluded,
      filters,
      breakdowns,
      segments,
      touch: {
        type: 'first',
      },
    } as FunnelQuery
  }
}

onMounted(async () => {
  reportsStore.loading = true
  eventsStore.initPeriod()
  await initEventsAndProperties()
  await reportsStore.getList()

  if (route.params?.id && reportsStore.reportsId.includes(Number(route.params.id))) {
    await updateReport(Number(route.params.id))
  }
  reportsStore.loading = false
})
</script>

<style lang="scss" scoped>
.pf-c-page {
  height: 100vh;
  &__main {
    overflow-y: hidden;
  }
}

.reports {
  height: calc(100vh - 43px);
  display: block;
  overflow-y: hidden;

  .overflow-auto {
    overflow: auto;
  }

  &__name {
    .pf-c-inline-edit__value {
      font-size: 20px;
    }
  }

  &__select {
    width: 220px;
  }

  &__nav {
    min-height: 34px;

    &-item {
      &_new {
        margin-left: -12px;
      }
    }
  }
}
</style>
