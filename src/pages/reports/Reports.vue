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
            <template v-if="reportsStore.loading" #action>
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
            v-if="isShowSaveReport"
            class="pf-m-link reports__nav-item reports__nav-item_new"
            :before-icon="'fas fa-floppy-disk'"
            @click="onSaveReport"
          >
            {{ $t('reports.save') }}
          </UiButton>
          <UiButton
            v-if="itemsReports.length && reportsStore.reportId"
            class="pf-m-link pf-m-danger"
            :before-icon="'fas fa-times'"
            @click="onDeleteReport"
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
        <RouterView />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { pagesMap } from '@/router'
import usei18n from '@/hooks/useI18n'
import { ReportType } from '@/api'
import { reportToStores } from '@/utils/reportsMappings'

import useConfirm from '@/hooks/useConfirm'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useReportsStore } from '@/stores/reports/reports'
import { useCommonStore } from '@/stores/common'
import { useLexiconStore } from '@/stores/lexicon'

import UiSelect from '@/components/uikit/UiSelect.vue'
import UiSwitch from '@/components/uikit/UiSwitch.vue'
import UiInlineEdit from '@/components/uikit/UiInlineEdit.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import { storeToRefs } from 'pinia'
import { REPORT_TABS } from './tabs'
import UiTabs from '@/components/uikit/UiTabs.vue'
import UiButton from '@/components/uikit/UiButton.vue'

const { t } = usei18n()
const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const reportsStore = useReportsStore()
const commonStore = useCommonStore()
const lexiconStore = useLexiconStore()
const { confirm } = useConfirm()

const editableNameReport = ref(false)
const reportName = ref('')
const showSyncReports = ref(false)

const { isChangedReport: isShowSaveReport } = storeToRefs(reportsStore)

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
  return reportsStore.list.map(item => {
    const id = Number(item.id)
    return {
      value: id,
      key: id,
      nameDisplay: item.name || '',
    }
  })
})

const untitledReportsList = computed(() => {
  return reportsStore.list.filter(
    item =>
      `${item.name.split(' ')[0]}` + ' ' + `${item.name.split(' ')[1]}` ===
      t('reports.untitledReport')
  )
})

const untitledReportName = computed(
  () => `${t('reports.untitledReport')} #${untitledReportsList.value.length + 1}`
)

const onEditNameReport = (payload: boolean) => {
  editableNameReport.value = payload
}

const onDeleteReport = async () => {
  try {
    confirm(
      t('reports.deleteConfirm', { name: `<b>${reportsStore?.activeReport?.name}</b>` || '' }),
      {
        applyButton: t('common.apply'),
        cancelButton: t('common.cancel'),
        title: t('reports.delete'),
        applyButtonClass: 'pf-m-danger',
      }
    )

    if (reportsStore.reportId !== null) {
      await reportsStore.deleteReport(reportsStore.reportId)
      reportsStore.reportId = null
    }

    await reportsStore.getList()
    reportsStore.emptyReport()
  } catch (error) {
    reportsStore.loading = false
  }
}

const onEditReport = async () => {
  await reportsStore.editReport(reportName.value || untitledReportName.value, reportType.value)
}

const onCreateReport = async () => {
  await reportsStore.createReport(untitledReportName.value, reportType.value)

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
  reportsStore.updateDump(reportType.value)
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
  reportsStore.updateDump(reportType.value)
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
    lexiconStore.getSystemProperties(),
    lexiconStore.getEventProperties(),
    await lexiconStore.getGroups(),
    lexiconStore.getGroupProperties(),
  ])
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

<style lang="scss">
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
