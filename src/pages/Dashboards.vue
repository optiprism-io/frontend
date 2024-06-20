<template>
  <div class="dashboards pf-u-p-md pf-u-pb-3xl">
    <div
      v-if="!isNoDate"
      class="dashboards__nav pf-u-px-sm pf-u-mb-sm pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center"
    >
      <UiSelect
        v-if="isShowSelectDashboard"
        class="dashboards__select pf-u-mr-md"
        :items="dashboardsList"
        :text-button="dashboardSelectText"
        :is-text-select="true"
        :selections="[Number(activeDashboardId)]"
        :is-toggle="false"
        :w-100="true"
        @on-select="onSelectDashboard"
      >
        <template v-if="isLoading" #action>
          <UiSpinner />
        </template>
      </UiSelect>
      <UiInlineEdit
        v-if="dashboards.length"
        class="dashboards__name pf-u-mr-md"
        :value="dashboardName"
        :hide-text="true"
        @on-input="updateName"
        @on-edit="onEditNameDashboard"
      />
      <UiButton
        v-if="isShowDashboardContentAndControls"
        class="pf-m-link dashboards__nav-item dashboards__nav-item_new"
        :before-icon="'fas fa-plus'"
        @click="setNew"
      >
        {{ $t('dashboards.createDashboard') }}
      </UiButton>
      <UiButton
        v-if="isShowDashboardContentAndControls"
        class="pf-m-link pf-m-danger"
        :before-icon="'fas fa-times'"
        @click="onDeleteDashboard"
      >
        {{ $t('dashboards.delete') }}
      </UiButton>
      <div class="pf-u-ml-auto">
        <UiSelect
          v-if="isShowDashboardContentAndControls && selectReportsList.length"
          class="pf-u-mr-md dashboards__add-report"
          :items="selectReportsList"
          :text-button="t('dashboards.addReport')"
          :placement="'bottom-end'"
          :is-text-select="true"
          @on-select="addReport"
        />
      </div>
    </div>
    <DashboardFilterToolbar v-if="!isNoDate" />
    <DataEmptyPlaceholder
      v-if="!isShowDashboardContentAndControls && !isLoading"
      :hide-icon="true"
      :h-100="true"
    >
      {{ t('dashboards.noDashboards') }}
      <UiButton
        class="pf-m-primary pf-u-ml-md"
        :before-icon="'fas fa-plus'"
        @click="setNew"
      >
        {{ $t('dashboards.createDashboard') }}
      </UiButton>
    </DataEmptyPlaceholder>
    <GridLayout
      v-if="layout.length"
      v-model:layout="layout"
      :col-num="12"
      :row-height="ROW_HEIGHT"
      :min-w="3"
      :min-h="4"
      :use-css-transforms="false"
    >
      <template #default="{ gridItemProps }">
        <GridItem
          v-for="item in layout"
          :key="item.i"
          v-bind="gridItemProps"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :min-h="item.minH"
          :min-w="item.minW"
          @moved="moved"
          @resized="resized"
        >
          <UiCard>
            <template #rightTitle>
              <UiDropdown
                class="pf-u-mr-md"
                :items="menuCardReport"
                :has-icon-arrow-button="false"
                :transparent="true"
                :placement-menu="'bottom-end'"
                @select-value="
                  (paylaod: UiDropdownItem<string>) => selectReportDropdown(paylaod, item.i)
                "
              >
                <template #button>
                  <button
                    class="pf-c-dropdown__toggle pf-m-plain"
                    aria-expanded="true"
                    type="button"
                    aria-label="Actions"
                  >
                    <i class="fas fa-ellipsis-v" aria-hidden="true" />
                  </button>
                </template>
              </UiDropdown>
            </template>
            <DashboardPanel
              :height-chart="item.h * ROW_HEIGHT - 20"
              :report-id="Number(item.reportId)"
            />
          </UiCard>
        </GridItem>
      </template>
    </GridLayout>
    <DataEmptyPlaceholder
      v-else-if="showReportdPlacholder"
      :hide-icon="true"
      :h-100="true"
    >
      {{ t('dashboards.noReportsInDashboard') }}
      <UiSelect
        class="pf-u-ml-auto pf-u-ml-md dashboards__add-report"
        :items="selectReportsList"
        :text-button="t('dashboards.addReport')"
        :placement="'bottom-end'"
        :is-text-select="true"
        @on-select="addReport"
      />
    </DataEmptyPlaceholder>
    <DataEmptyPlaceholder
      v-else-if="dashboards.length && !isLoading"
      :hide-icon="true"
      :h-100="true"
    >
      {{ t('dashboards.noReports') }}
      <RouterLink :to="pagesMap.reports" aria-current="page">
        <UiButton class="pf-m-primary pf-u-ml-md">
          {{ $t('dashboards.createReport') }}
        </UiButton>
      </RouterLink>
    </DataEmptyPlaceholder>
    <DashboardReportsPopup
      v-if="visibleReportsPopup"
      :reports="reportsList"
      :loading="false"
      @on-select-report="onSelectReport"
      @cancel="closeDashboardReportsPopup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { useRoute, useRouter, RouterLink } from 'vue-router'
import { GridLayout, GridItem } from 'vue3-drr-grid-layout'

import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import DashboardFilterToolbar from '@/components/dashboards/DashboardFilterToolbar.vue'
import DashboardPanel from '@/components/dashboards/DashboardPanel.vue'
import DashboardReportsPopup from '@/components/dashboards/DashboardReportsPopup.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import type { UiDropdownItem } from '@/components/uikit/UiDropdown.vue';
import UiDropdown from '@/components/uikit/UiDropdown.vue'
import UiInlineEdit from '@/components/uikit/UiInlineEdit.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'

import { DashboardPanelTypeEnum } from '@/api'
import { apiClient } from '@/api/apiClient'
import useConfirm from '@/hooks/useConfirm'
import usei18n from '@/hooks/useI18n'
import { pagesMap } from '@/router'
import { useDashboardsStore } from '@/stores/dashboards'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'
import { useProjectsStore } from '@/stores/projects/projects'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useReportsStore } from '@/stores/reports/reports'

import type { DashboardPanel as DashboardPanelType} from '@/api';

const { t } = usei18n()
const route = useRoute()
const router = useRouter()
const dashboardsStore = useDashboardsStore()
const reportsStore = useReportsStore()
const lexiconStore = useLexiconStore()
const filterGroupsStore = useFilterGroupsStore()
const eventsStore = useEventsStore()
const projectsStore = useProjectsStore()

const { confirm } = useConfirm()
const isLoading = ref(true)
const updateLoading = ref(false)

const ROW_HEIGHT = 56

interface Layout extends DashboardPanelType {
  i: number
  minH: number
  minW: number
}

const layout = ref<Layout[]>([])
const editableNameDashboard = ref(false)
const visibleReportsPopup = ref(false)
const dashboardName = ref('')
const activeDashboardId = ref<number | null>(null)
const editPanel = ref<number | null>(null)
const dashboards = computed(() => dashboardsStore.dashboards)
const reportsList = computed(() => reportsStore.list)
const isNoDate = computed(() => !dashboardsStore.dashboards.length)

const dashboardsId = computed((): number[] => {
  return dashboards.value.map(item => Number(item.id))
})

const activeDashboard = computed(() => {
  return dashboards.value.find(item => Number(item.id) === activeDashboardId.value) ?? null
})

const isShowDashboardContentAndControls = computed(() => {
  return dashboards.value.length && activeDashboardId.value
})

const isShowSelectDashboard = computed(() => {
  return (
    !editableNameDashboard.value && (isLoading.value || isShowDashboardContentAndControls.value)
  )
})

const menuCardReport = computed<UiDropdownItem<string>[]>(() => {
  return [
    {
      key: 0,
      value: 'edit',
      nameDisplay: t('dashboards.changeReport'),
    },
    {
      key: 1,
      value: 'delete',
      nameDisplay: t('common.delete'),
    },
  ]
})

const dashboardSelectText = computed(() => {
  return dashboardName.value || activeDashboard.value?.name || ''
})

const dashboardsList = computed(() => {
  return dashboards.value.map(item => {
    const id = Number(item.id)
    return {
      value: id,
      key: id,
      nameDisplay: item.name || '',
    }
  })
})

const untitledDashboardName = computed(() => {
  return `${t('dashboards.untitledDashboard')} #${untitledDashboardsList.value.length + 1}`
})

const untitledDashboardsList = computed(() => {
  return dashboards.value.filter(
    item =>
      `${item.name.split(' ')[0]}` + ' ' + `${item.name.split(' ')[1]}` ===
      t('dashboards.untitledDashboard')
  )
})

const showReportdPlacholder = computed(() => {
  return (
    !isLoading.value &&
    !layout.value.length &&
    selectReportsList.value.length &&
    activeDashboardId.value
  )
})

const selectReportsList = computed(() => {
  return reportsList.value.map(item => {
    const id = Number(item.id)
    return {
      value: id,
      key: id,
      nameDisplay: item.name || '',
    }
  })
})

const updateLauout = () => {
  if (activeDashboard.value) {
    dashboardName.value = activeDashboard.value?.name || ''
    const newLayout =
      activeDashboard.value?.panels?.map((item: DashboardPanelType, i: number) => {
        return {
          ...item,
          i,
          minH: 5,
          minW: 3,
        }
      }) || []

    if (JSON.stringify(newLayout) !== JSON.stringify(layout.value)) {
      layout.value = newLayout
    }
  }
}

const onSelectDashboard = (id: number | string) => {
  activeDashboardId.value = Number(id)
  router.push({ query: { id } })
  updateLauout()
}

const getDashboardsList = async () => {
  await dashboardsStore.getDashboards()
}

const updateCreateDashboard = async (panels?: Layout[]) => {
  try {
    const dataForRequest = {
      name: dashboardName.value || untitledDashboardName.value,
      panels: (panels || layout.value).map(item => {
        return {
          type: DashboardPanelTypeEnum.Report,
          reportId: item.reportId,
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        }
      }),
    }
    if (activeDashboardId.value) {
      await apiClient.dashboards.updateDashboard(
        projectsStore.projectId,
        activeDashboardId.value,
        dataForRequest
      )
    } else {
      const res = await  apiClient.dashboards.createDashboard(projectsStore.projectId, dataForRequest)
      if (res.data?.id) {
        dashboardName.value = res.data?.name || dashboardName.value || untitledDashboardName.value
        onSelectDashboard(res.data?.id)
      }
    }
  } catch (e) {
    throw new Error('error updateCreateDashboard')
  }
}

const onDeleteDashboard = async () => {
  if (activeDashboardId.value) {
    await confirm(
      t('dashboards.deleteConfirm', { name: `<b>${activeDashboard?.value?.name}</b>` || '' }),
      {
        applyButton: t('common.apply'),
        cancelButton: t('common.cancel'),
        title: t('dashboards.delete'),
        applyButtonClass: 'pf-m-danger',
      }
    )

    await apiClient.dashboards.deleteDashboard(projectsStore.projectId, activeDashboardId.value)
    await getDashboardsList()

    if (dashboardsId.value?.length) {
      onSelectDashboard(dashboardsId.value[0])
    } else {
      layout.value = []
    }
  }
}

const onSelectReport = (payload: number) => {
  const items = layout.value
  const panelIndex = items.findIndex(item => Number(item.i) === editPanel.value)
  items[panelIndex].reportId = payload
  layout.value = items
  closeDashboardReportsPopup()
  onChange()
}

const closeDashboardReportsPopup = () => {
  visibleReportsPopup.value = false
  editPanel.value = null
}

const addReport = async (payload: number) => {
  const panel = {
    type: DashboardPanelTypeEnum.Report,
    reportId: payload,
    i: layout.value.length + 1,
    x: 0,
    y: 0,
    w: 3,
    h: 5,
    minH: 5,
    minW: 3,
  }
  await updateCreateDashboard([panel, ...layout.value])
  layout.value = [panel, ...layout.value]
  getDashboardsList()
}

const selectReportDropdown = async (payload: UiDropdownItem<string>, id: number) => {
  if (payload.value === 'delete') {
    layout.value = layout.value.filter(item => item.i !== id)
    setTimeout(() => {
      updateCreateDashboard()
    }, 800)
  }
  if (payload.value === 'edit') {
    editPanel.value = id
    visibleReportsPopup.value = true
  }
}

const initDashboardPage = async () => {
  const dashboardId =
    (dashboardsId.value.includes(Number(route.query?.id))
      ? route.query?.id
      : dashboardsId.value[0]) || null

  if (dashboardId) {
    onSelectDashboard(Number(dashboardId))
  }

  isLoading.value = false

  lexiconStore.getSystemProperties()
  lexiconStore.getEventProperties()
  await lexiconStore.getGroups()
  lexiconStore.getGroupProperties()
}

const onEditNameDashboard = (payload: boolean) => {
  dashboardName.value = dashboardSelectText.value
  editableNameDashboard.value = payload
}

const onChange = async () => {
  updateLoading.value = true
  await updateCreateDashboard()
  await getDashboardsList()
  updateLoading.value = false
}

const moved = () => {
  onChange()
}

const resized = () => {
  onChange()
}

const setNew = async () => {
  isLoading.value = true
  layout.value = []
  activeDashboardId.value = null
  dashboardName.value = ''

  await onChange()
  isLoading.value = false
}

const updateName = async (payload: string) => {
  dashboardName.value = payload
  onChange()
}

onMounted(async () => {
  await reportsStore.getList()
  await getDashboardsList()
  initDashboardPage()
})

onUnmounted(() => {
  activeDashboardId.value = null
  eventsStore.$reset()
  filterGroupsStore.$reset()
})
</script>

<style lang="scss">
.dashboards {
  .vue-grid-item {
    .pf-c-card__body {
      height: calc(100% - 36px);
    }
  }
  &__add-report,
  .pf-c-inline-edit__input,
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
  &__add-report-button {
    width: 100%;
  }
  &__new-item {
    min-height: 250px;
    height: 100%;
    cursor: pointer;
    background-color: var(--pf-global--palette--green-50);
    &_small {
      min-height: 50px;
    }
  }
  &__new-item-icon {
    color: var(--pf-global--Color--300);
  }
  &__name {
    .pf-c-inline-edit__value {
      font-size: 20px;
    }
  }
  &__panel {
    position: relative;
    min-height: 250px;
    width: 100%;
    &_padding {
      padding-left: 65px;
    }
  }
  &__new {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    &_small {
      max-width: 50px;
    }
  }
  &__stock {
    min-height: calc(100vh - 174px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__stock-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>
