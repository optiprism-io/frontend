<template>
  <GridContainer class="pf-u-h-100">
    <GridItem
      class="overflow-auto pf-u-pb-md"
      :col-lg="3"
    >
      <GridContainer>
        <UiCardContainer>
          <UiCardBody>
            <UiSelect
              v-if="selectedGroup?.name"
              :items="selectGroups"
              :width-auto="true"
              :selections="[selectedGroup.id]"
              @on-select="onSelectGroup"
            >
              <template #action>
                <UiButton
                  :is-link="true"
                  after-icon="fas fa-chevron-down"
                >
                  {{ selectedGroupByString }}
                </UiButton>
              </template>
            </UiSelect>
          </UiCardBody>
        </UiCardContainer>
        <UiCardContainer :title="$t('funnels.steps.title')">
          <UiCardTitle>
            {{ $t('funnels.steps.title') }}
          </UiCardTitle>
          <UiCardBody>
            <StepsList />
          </UiCardBody>
          <UiCardTitle>
            {{ $t('criteria.label') }}
          </UiCardTitle>
          <UiCardBody class="pf-l-flex pf-m-column">
            <TimeWindow />
            <HoldingConstantList />
            <ExcludeStepsList />
          </UiCardBody>
          <UiCardBody class="pf-l-flex">
            <ExcludeStepSelect />
            <HoldingConstantSelect />
          </UiCardBody>
        </UiCardContainer>
        <UiCardContainer>
          <FilterReports />
        </UiCardContainer>
        <UiCard :title="$t('funnels.breakdowns')">
          <Breakdowns />
        </UiCard>
      </GridContainer>
    </GridItem>
    <GridItem
      class="overflow-auto pf-u-pb-md"
      :col-lg="9"
    >
      <FunnelSteps
        v-if="funnelView === FunnelStepsChartTypeTypeEnum.Steps"
        :funnel-view="funnelView"
        :period="period"
        :controls-period="controlsPeriod"
        :time="time"
        @change-view="emit('change-view', $event)"
        @change-period="setPeriod"
        @change-controls-period="setControlsPeriod"
      />
      <ConversionOverTime
        v-else-if="funnelView === FunnelConversionOverTimeChartTypeTypeEnum.ConversionOverTime"
        :funnel-view="funnelView"
        :period="period"
        :controls-period="controlsPeriod"
        :time="time"
        :time-interval="timeInterval"
        @change-view="emit('change-view', $event)"
        @change-period="setPeriod"
        @change-controls-period="setControlsPeriod"
        @select-time-interval="emit('select-time-interval', $event)"
      />
    </GridItem>
  </GridContainer>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'

import { useI18n } from 'vue-i18n'

import Breakdowns from '@/components/events/Breakdowns.vue'
import FilterReports from '@/components/events/FiltersReports.vue'
import ExcludeStepSelect from '@/components/funnels/exclude/ExcludeStepSelect.vue'
import ExcludeStepsList from '@/components/funnels/exclude/ExcludeStepsList.vue'
import HoldingConstantList from '@/components/funnels/holding/HoldingConstantList.vue'
import HoldingConstantSelect from '@/components/funnels/holding/HoldingConstantSelect.vue'
import StepsList from '@/components/funnels/steps/StepsList.vue'
import TimeWindow from '@/components/funnels/time-window/TimeWindow.vue'
import ConversionOverTime from '@/components/funnels/view/conversion-over-time/ConversionOverTime.vue'
import FunnelSteps from '@/components/funnels/view/funnel-steps/FunnelSteps.vue'
import GridContainer from '@/components/grid/GridContainer.vue'
import GridItem from '@/components/grid/GridItem.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiCardBody from '@/components/uikit/UiCard/UiCardBody.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiCardTitle from '@/components/uikit/UiCard/UiCardTitle.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'

import {
  FunnelConversionOverTimeChartTypeTypeEnum,
  FunnelStepsChartTypeTypeEnum,
  type TimeUnit,
} from '@/api'
import { useCalendarTime } from '@/components/funnels/view/useCalendarTime'
import { useGroup } from '@/hooks/useGroup'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useStepsStore } from '@/stores/funnels/steps'
import { useLexiconStore } from '@/stores/lexicon'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useSegmentsStore } from '@/stores/reports/segments'
import { funnelsToEvents } from '@/utils/reportsMappings'

import type { FunnelChartType } from '@/pages/reports/funnelViews'

defineProps<{
  funnelView: FunnelChartType
  timeInterval: TimeUnit
}>()

const emit = defineEmits<{
  (e: 'change-view', payload: FunnelChartType): void
  (e: 'select-time-interval', payload: TimeUnit): void
}>()

const { t } = useI18n()
const eventsStore = useEventsStore()
const filterGroupsStore = useFilterGroupsStore()
const segmentsStore = useSegmentsStore()
const commonStore = useCommonStore()
const lexiconStore = useLexiconStore()
const { selectGroups } = useGroup()
const stepsStore = useStepsStore()

const { period, controlsPeriod, time, setPeriod, setControlsPeriod } = useCalendarTime()

const selectedGroup = computed(() => lexiconStore.groups.find(item => item.id === stepsStore.group))
const selectedGroupByString = computed(
  () => `${t('common.group', { name: selectedGroup.value?.name })}`
)

const onSelectGroup = (id: number) => {
  stepsStore.group = id
}

onUnmounted(() => {
  if (commonStore.syncReports) {
    funnelsToEvents()
  } else {
    eventsStore.$reset()
    filterGroupsStore.$reset()
    segmentsStore.$reset()
  }
  stepsStore.$reset()
})
</script>
