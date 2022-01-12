<template>
    <h1 class="page-title">
        Event Segmentation
    </h1>
    <div class="pf-l-grid pf-m-gutter">
        <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Events</p>
                </div>
                <div class="pf-c-card__body">
                    <Events />
                </div>
            </div>
        </div>
        <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Segments</p>
                </div>
                <div class="pf-c-card__body">
                    <Breakdowns />
                </div>
            </div>
        </div>
        <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-compact pf-u-h-100">
                <div class="pf-c-card__title">
                    <p>Filters</p>
                </div>
                <div class="pf-c-card__body">
                    <Filters />
                </div>
            </div>
        </div>
        <div class="pf-l-grid__item pf-m-6-col">
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
            <div class="pf-c-card pf-m-compact">
                <div
                    class="pf-c-card__title pf-u-text-align-center pf-u-font-size-lg pf-u-color-200"
                >
                    Select at least one events by clicking
                    <b>+ add event</b>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import Events from "@/components/events/Events/Events.vue";
import Breakdowns from "@/components/events/Breakdowns/Breakdowns.vue";
import Filters from "@/components/events/Filters/Filters.vue";
import { useLexiconStore } from "@/stores/lexicon";

const lexiconStore = useLexiconStore();

onBeforeMount(() => {
    lexiconStore.getEvents();
    lexiconStore.getEventProperties();
    lexiconStore.getUserProperties();
});
</script>

<style scoped lang="scss">
.page-title {
    color: var(--op-base-color);
    font-size: 1.4rem;
    margin-bottom: .2rem;
}
</style>
