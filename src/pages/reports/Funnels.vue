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
                  :after-icon="'fas fa-chevron-down'"
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
      <FunnelsViews />
    </GridItem>
  </GridContainer>
</template>

<script setup lang="ts">
import { onUnmounted, computed } from 'vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import TimeWindow from '@/components/funnels/time-window/TimeWindow.vue'
import UiCardTitle from '@/components/uikit/UiCard/UiCardTitle.vue'
import UiCardBody from '@/components/uikit/UiCard/UiCardBody.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import Breakdowns from '@/components/events/Breakdowns.vue'
import ExcludeStepsList from '@/components/funnels/exclude/ExcludeStepsList.vue'
import HoldingConstantSelect from '@/components/funnels/holding/HoldingConstantSelect.vue'
import ExcludeStepSelect from '@/components/funnels/exclude/ExcludeStepSelect.vue'
import HoldingConstantList from '@/components/funnels/holding/HoldingConstantList.vue'
import StepsList from '@/components/funnels/steps/StepsList.vue'
import FunnelsViews from '@/components/funnels/view/FunnelsViews.vue'
import FilterReports from '@/components/events/FiltersReports.vue'
import GridContainer from '@/components/grid/GridContainer.vue'
import GridItem from '@/components/grid/GridItem.vue'
import { funnelsToEvents } from '@/utils/reportsMappings'
import usei18n from '@/hooks/useI18n';

import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useSegmentsStore } from '@/stores/reports/segments'
import { useCommonStore } from '@/stores/common'
import { useLexiconStore } from '@/stores/lexicon'
import { useStepsStore } from '@/stores/funnels/steps'
import { useGroup } from '@/hooks/useGroup'

const { t } = usei18n()
const eventsStore = useEventsStore()
const filterGroupsStore = useFilterGroupsStore()
const segmentsStore = useSegmentsStore()
const commonStore = useCommonStore()
const lexiconStore = useLexiconStore()
const { selectGroups } = useGroup()
const stepsStore = useStepsStore()

const selectedGroup = computed(() => lexiconStore.groups.find(item => item.id === stepsStore.group))
const selectedGroupByString = computed(() => `${t('common.group', { name: selectedGroup.value?.name })}`)

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
