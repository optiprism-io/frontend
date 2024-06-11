<template>
  <GridContainer class="pf-u-h-100">
    <GridItem
      :col-lg="3"
      class="overflow-auto pf-u-pb-md"
    >
      <GridContainer>
        <UiCard class="filter-event-segmentation__item">
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
        </UiCard>
        <UiCard class="filter-event-segmentation__item" :title="$t('events.events')">
          <Events @on-change="onChange" />
        </UiCard>
        <UiCardContainer class="filter-event-segmentation__item">
          <FilterReports @on-change="onChange" />
        </UiCardContainer>
        <UiCard class="filter-event-segmentation__item" :title="$t('events.breakdowns')">
          <Breakdowns @on-change="onChange" />
        </UiCard>
      </GridContainer>
    </GridItem>
    <GridItem
      :col-lg="9"
      class="overflow-auto pf-u-pb-md"
    >
      <EventsViews
        :event-segmentation="eventSegmentation"
        :loading="eventSegmentationLoading"
        :report="activeReport"
        @on-change="onChange"
      />
    </GridItem>
  </GridContainer>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

import Breakdowns from '@/components/events/Breakdowns.vue'
import Events from '@/components/events/Events/Events.vue'
import EventsViews from '@/components/events/EventsViews.vue'
import FilterReports from '@/components/events/FiltersReports.vue'
import GridContainer from '@/components/grid/GridContainer.vue'
import GridItem from '@/components/grid/GridItem.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'

import { EventSegmentationQueryFormatEnum } from '@/api'
import { apiClient } from '@/api/apiClient'
import { useGroup } from '@/hooks/useGroup'
import usei18n from '@/hooks/useI18n'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'
import { useProjectsStore } from '@/stores/projects/projects'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useReportsStore } from '@/stores/reports/reports'
import { useSegmentsStore } from '@/stores/reports/segments'
import { eventsToFunnels } from '@/utils/reportsMappings'

import type { DataTableResponse} from '@/api';

const { t } = usei18n()
const projectsStore = useProjectsStore()
const eventsStore = useEventsStore()
const filterGroupsStore = useFilterGroupsStore()
const commonStore = useCommonStore()
const segmentsStore = useSegmentsStore()
const reportsStore = useReportsStore()
const lexiconStore = useLexiconStore()
const { selectGroups } = useGroup()

const selectedGroup = computed(() => lexiconStore.groups.find(item => item.id === eventsStore.group))
const selectedGroupByString = computed(() => `${t('common.group', { name: selectedGroup.value?.name })}`)
const eventSegmentationLoading = ref(false)
const eventSegmentation = ref<DataTableResponse | null>()

const emit = defineEmits<{
  (e: 'on-change'): void
}>()

const activeReport = computed(() => reportsStore.activeReport)

onUnmounted(() => {
  if (commonStore.syncReports) {
    eventsToFunnels()
  } else {
    eventsStore.$reset()
    filterGroupsStore.$reset()
    segmentsStore.$reset()
  }
})

const getEventSegmentation = async () => {
  if (eventsStore.propsForEventSegmentationResult.events.length) {
    eventSegmentationLoading.value = true

    try {
      const res = await apiClient.query.eventSegmentationQuery(
        projectsStore.projectId,
        EventSegmentationQueryFormatEnum.Json,
        eventsStore.propsForEventSegmentationResult
      )
      if (res) {
        eventSegmentation.value = res.data as DataTableResponse
      }
    } catch (error) {
      throw new Error('error getEvent Segmentation')
    }
  } else {
    eventSegmentation.value = null
  }
  eventSegmentationLoading.value = false
}

const onChange = () => {
  getEventSegmentation()
  emit('on-change')
}

const onSelectGroup = (value: number) => {
  eventsStore.group = value
  getEventSegmentation()
}

watch(
  () => activeReport.value,
  () => {
    getEventSegmentation()
  }
)

watch(
  () => reportsStore.updateToEmpty,
  value => {
    if (value === true) {
      eventsStore.$reset()
      eventsStore.events = []
      filterGroupsStore.$reset()
      segmentsStore.$reset()
      getEventSegmentation()
      reportsStore.updateToEmpty = false
    }
  }
)
</script>

<style scoped lang="scss">
.page-title {
  color: var(--op-base-color);
  font-size: 1.4rem;
  margin-bottom: 0.2rem;
}

.filter-event-segmentation__item {
  overflow: auto;
}
</style>
