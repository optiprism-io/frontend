<template>
    <TemplateReport>
        <template #content>
            <GridContainer>
                <GridItem :col-lg="6">
                    <UiCard :title="$t('events.events')">
                        <Events @on-change="onChange" />
                    </UiCard>
                </GridItem>
                <GridItem :col-lg="6">
                    <UiCard :title="$t('events.segments.label')">
                        <Segments @on-change="onChangeDebounce" />
                    </UiCard>
                </GridItem>
                <GridItem :col-lg="6">
                    <UiCardContainer>
                        <FilterReports @on-change="onChangeDebounce" />
                    </UiCardContainer>
                </GridItem>
                <GridItem :col-lg="6">
                    <UiCard :title="$t('events.breakdowns')">
                        <Breakdowns @on-change="onChangeDebounce" />
                    </UiCard>
                </GridItem>
            </GridContainer>
        </template>
        <template #views>
            <EventsViews
                :event-segmentation="eventSegmentation"
                :loading="eventSegmentationLoading"
                @on-change="onChangeDebounce"
            />
        </template>
    </TemplateReport>
</template>

<script setup lang="ts">
import { onUnmounted, onMounted, ref } from 'vue';
import { debounce } from 'lodash';
import Events from '@/components/events/Events/Events.vue';
import Breakdowns from '@/components/events/Breakdowns.vue';
import Segments from '@/components/events/Segments/Segments.vue';
import EventsViews from '@/components/events/EventsViews.vue';
import UiCard from '@/components/uikit/UiCard/UiCard.vue';
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import FilterReports from '@/components/events/FiltersReports.vue'
import TemplateReport from '@/components/events/TemplateReport.vue'
import GridContainer from '@/components/grid/GridContainer.vue';
import GridItem from '@/components/grid/GridItem.vue';
import reportsService from '@/api/services/reports.service'
import { DataTableResponse } from '@/api'
import { eventsToFunnels } from '@/utils/reportsMappings'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useCommonStore } from '@/stores/common'
import { useSegmentsStore } from '@/stores/reports/segments';

const eventsStore = useEventsStore();
const filterGroupsStore = useFilterGroupsStore();
const commonStore = useCommonStore();
const segmentsStore = useSegmentsStore();

const eventSegmentationLoading = ref(false);
const eventSegmentation = ref<DataTableResponse>();

const emit = defineEmits<{
    (e: 'on-change'): void
}>();

onUnmounted(() => {
    if (commonStore.syncReports) {
        eventsToFunnels()
    } else {
        eventsStore.$reset()
        filterGroupsStore.$reset()
        segmentsStore.$reset()
    }
});

const getEventSegmentation = async () => {
    if (eventsStore.propsForEventSegmentationResult.events.length) {
        eventSegmentationLoading.value = true;
        try {
            const res = await reportsService.eventSegmentation(commonStore.organizationId, commonStore.projectId,  eventsStore.propsForEventSegmentationResult);
            if (res) {
                eventSegmentation.value = res.data as DataTableResponse;
            }
        } catch (error) {
            console.log('error event segmentation');
        }
        eventSegmentationLoading.value = false;
    }
};

onMounted(() => {
    getEventSegmentation();
});

const onChange = () => {
    getEventSegmentation();
    emit('on-change');
};

const onChangeDebounce = debounce(() => {
    onChange();
}, 1100);
</script>

<style scoped lang="scss">
.page-title {
    color: var(--op-base-color);
    font-size: 1.4rem;
    margin-bottom: .2rem;
}
</style>
