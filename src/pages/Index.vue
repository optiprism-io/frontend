<template>
    <h1 class="pf-u-font-size-2xl pf-u-mb-md">
        Event Segmentation
    </h1>
    <div class="pf-l-grid pf-m-gutter">
        <div class="pf-l-grid__item pf-m-12-col-on-md pf-m-6-col-on-2xl">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Events</p>
                </div>
                <div class="pf-c-card__body">
                    <Events />
                </div>
            </div>
        </div>
        <!-- TODO Segments implement later -->
        <!-- <div class="pf-l-grid__item pf-m-12-col-on-md pf-m-6-col-on-2xl">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Segments</p>
                </div>
                <div class="pf-c-card__body">
                    <Breakdowns />
                </div>
            </div>
        </div> -->
        <div class="pf-l-grid__item pf-m-12-col pf-m-6-col-on-lg">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Filters</p>
                </div>
                <div class="pf-c-card__body">
                    <Filters />
                </div>
            </div>
        </div>
        <div class="pf-l-grid__item pf-m-12-col pf-m-6-col-on-lg">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Breakdowns</p>
                </div>
                <div class="pf-c-card__body">
                    <Breakdowns />
                </div>
            </div>
        </div>
        <div class="pf-l-grid__item pf-m-12-col">
            <div class="pf-c-card pf-u-p-md">
                <div class="content-info-controls" />
                <ChartWrapper
                    v-if="chartEventsOptions"
                    :options="chartEventsOptions"
                    :type="'line'"
                />
                <div
                    v-else
                    class="content-info"
                >
                    <div class="pf-u-display-flex content-info__icons pf-u-color-400">
                        <UiIcon
                            class="content-info__icon"
                            :icon="'fas fa-chart-pie'"
                        />
                        <UiIcon
                            class="content-info__icon"
                            :icon="'fas fa-chart-line'"
                        />
                    </div>
                    <div class="pf-c-card__title pf-u-text-align-center pf-u-font-size-lg pf-u-color-400">
                        Select at least one events by clicking
                        <b>+ add event</b>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onUnmounted } from "vue";
import Events from "@/components/events/Events/Events.vue";
import Breakdowns from "@/components/events/Breakdowns.vue";
import Filters from "@/components/events/Filters.vue";
import ChartWrapper from "@/components/charts/ChartWrapper.vue";
import { useLexiconStore } from "@/stores/lexicon";
import { useEventsStore } from "@/stores/eventSegmentation/events";
import eventService from "@/api/services/schema.service";

const lexiconStore = useLexiconStore();
const eventsStore = useEventsStore();
const chartEventsOptions = ref();

onBeforeMount(async () => {
    lexiconStore.getEvents();
    lexiconStore.getEventProperties();
    lexiconStore.getUserProperties();

    const res = await eventService.getEventChart();
    chartEventsOptions.value = {
        data: res,
    };
});

onUnmounted(() => {
    eventsStore.$reset();
});
</script>

<style scoped lang="scss">
.page-title {
    color: var(--op-base-color);
    font-size: 1.4rem;
    margin-bottom: .2rem;
}

.content-info {
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__icons {
        margin-bottom: 25px;
        font-size: 68px;
    }

    &__icon {
        margin: 0 15px;
        // color: var(--op-base-color-text);
    }
}
</style>
