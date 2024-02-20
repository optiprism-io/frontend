<template>
  <section class="reports">
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
    <UiTabs class="pf-u-w-100 pf-u-mb-lg" :items="items" @on-select="onSelectTab" />
    <router-view />
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

const reportsId = computed((): number[] => reportsStore.reportsId)

const items = computed(() => {
  const mapTabs = [
    {
      name: t('events.event_segmentation'),
      value: pagesMap.reportsEventSegmentation.name,
      link: {
        name: pagesMap.reportsEventSegmentation.name,
      },
    },
    {
      name: t('funnels.funnels'),
      value: pagesMap.funnels.name,
      link: {
        name: pagesMap.funnels.name,
      },
    },
  ]

  return mapTabs.map(item => {
    return {
      ...item,
      active: route.name === item.value,
    }
  })
})

const reportSelectText = computed(() => {
  return reportsStore.activeReport ? reportsStore.activeReport.name : t('reports.selectReport')
})

const reportType = computed(() => {
  return pagesMap.reportsEventSegmentation.name === route.name
    ? ReportType.EventSegmentation
    : ReportType.Funnel
})

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

const untitledReportName = computed(() => {
  return `${t('reports.untitledReport')} #${untitledReportsList.value.length + 1}`
})

const isShowSaveReport = computed(() => reportsStore.isChangedReport)

const onEditNameReport = (payload: boolean) => {
  editableNameReport.value = payload
}

const onDeleteReport = async () => {
  try {
    await confirm(
      t('reports.deleteConfirm', { name: `<b>${reportsStore?.activeReport?.name}</b>` || '' }),
      {
        applyButton: t('common.apply'),
        cancelButton: t('common.cancel'),
        title: t('reports.delete'),
        applyButtonClass: 'pf-m-danger',
      }
    )

    reportsStore.deleteReport(reportsStore.reportId)
    reportsStore.getList()
  } catch (error) {
    reportsStore.loading = false
  }
}

const onEditReport = () => {
  reportsStore.editReport(reportName.value || untitledReportName.value, reportType.value)
}

const onCreateReport = async () => {
  await reportsStore.createReport(reportName.value || untitledReportName.value, reportType.value)

  router.push({
    params: {
      id: reportsStore.reportId,
    },
    query: route.query,
  })
}

const onUpdateReport = () => {
  if (reportsStore.reportId) {
    onEditReport()
  } else {
    onCreateReport()
  }
}

const onSaveReport = async () => {
  reportsStore.loading = true
  onUpdateReport()
  await reportsStore.getList()
  reportsStore.updateDump(reportType.value)
  reportsStore.loading = false
}

const setNameReport = (payload: string) => {
  reportName.value = payload
  onSaveReport()
}

const setNew = async () => {
  router.push(pagesMap.reportsEventSegmentation.name)

  const routeData = router.resolve({
    name: pagesMap.reportsEventSegmentation.name,
  })

  window.open(routeData.href, '_blank')
}

const onSelectTab = (value: string) => {
  if (reportsStore.reportId) {
    if (value === pagesMap.reportsEventSegmentation.name) {
      setNew()
    }
  } else if (route.name === value) {
    location.reload()
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
  router.push({
    params: {
      id,
    },
    query: route.query,
  })
}

const initReportPage = async () => {
  const reportId =
    (reportsId.value.includes(Number(route.params?.id)) ? route.params?.id : reportsId.value[0]) ||
    null

  if (reportId) {
    await onSelectReport(Number(reportId))
  }

  reportsStore.loading = false
}

const initEventsAndProperties = async () => {
  await Promise.all([
    lexiconStore.getEvents(),
    lexiconStore.getSystemProperties(),
    lexiconStore.getEventProperties(),
    lexiconStore.getUserProperties(),
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
.reports {
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
