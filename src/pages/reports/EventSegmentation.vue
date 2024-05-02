<template>
  <GridContainer class="pf-u-h-100">
    <GridItem
      :col-lg="3"
      class="overflow-auto pf-u-pb-md"
    >
      <GridContainer>
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
import { onUnmounted, ref, computed, watch } from 'vue'
import Events from '@/components/events/Events/Events.vue'
import Breakdowns from '@/components/events/Breakdowns.vue'
import Segments from '@/components/events/Segments/Segments.vue'
import EventsViews from '@/components/events/EventsViews.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import FilterReports from '@/components/events/FiltersReports.vue'
import GridContainer from '@/components/grid/GridContainer.vue'
import GridItem from '@/components/grid/GridItem.vue'
import reportsService from '@/api/services/reports.service'
import { DataTableResponse } from '@/api'
import { eventsToFunnels } from '@/utils/reportsMappings'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useCommonStore } from '@/stores/common'
import { useSegmentsStore } from '@/stores/reports/segments'
import { useReportsStore } from '@/stores/reports/reports'
import { useProjectsStore } from '@/stores/projects/projects'

const projectsStore = useProjectsStore()
const eventsStore = useEventsStore()
const filterGroupsStore = useFilterGroupsStore()
const commonStore = useCommonStore()
const segmentsStore = useSegmentsStore()
const reportsStore = useReportsStore()

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
      const res = await reportsService.eventSegmentation(
        projectsStore.projectId,
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

<style lang="scss">
.page-title {
  color: var(--op-base-color);
  font-size: 1.4rem;
  margin-bottom: 0.2rem;
}

.filter-event-segmentation__item {
  overflow: auto;
}
</style>
