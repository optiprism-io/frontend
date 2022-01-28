<template>
    <div class="pf-c-card">
        <div class="pf-c-toolbar">
            <div class="pf-c-toolbar__content">
                <div class="pf-c-toolbar__content-section pf-m-nowrap">
                    <div class="pf-c-toolbar__item">
                        <UiDropdown
                            :items="itemsGroupBy"
                            :text-button="selectedGroupByString"
                            @select="onSelectGroupBy"
                        />
                    </div>
                    <div class="pf-c-toolbar__item">
                        <UiToggleGroup
                            :items="itemsPeriod"
                            @select="onSelectPerion"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="pf-c-scroll-inner-wrapper pf-u-p-md">
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
</template>

<script lang="ts" setup>
import {ref, computed, onBeforeMount} from "vue";
import ChartWrapper from "@/components/charts/ChartWrapper.vue";
import {UiDropdownItem, GenericUiDropdown} from "@/components/uikit/UiDropdown.vue";
import {useEventsStore} from "@/stores/eventSegmentation/events";
import eventService from "@/api/services/schema.service";
import {groupByMap, periodMap} from "@/configs/events/controls" ;
import {UiToggleGroupItem} from "@/components/uikit/UiToggleGroup.vue";

const UiDropdown = GenericUiDropdown<string>();

const eventsStore = useEventsStore();
const chartEventsOptions = ref();

const itemsGroupBy = computed(() => {
    return groupByMap.map((key): UiDropdownItem<string> => ({
        key,
        nameDisplay: key,
        value: key,
        selected: key === eventsStore.controlsGroupBy,
    }))
});

const itemsPeriod = computed(() => {
    const activeKey: string = eventsStore.controlsGroupBy;
    const config = periodMap.find(item => item.type === activeKey);


    if (config) {
        return config.items.map((key, i): UiToggleGroupItem => ({
            key,
            nameDisplay: key + config.text,
            value: key,
            selected: eventsStore.controlsGroupBy ? key === eventsStore.controlsPeriod : i === 0,
        }));
    } else {
        return [];
    }
})

const selectedGroupByString = computed(() => {
    const selectedGroupBy = itemsGroupBy.value.find(item => item.selected);

    return selectedGroupBy ? `Group by ${selectedGroupBy.nameDisplay}` : '';
});

onBeforeMount(async () => {
    const res = await eventService.getEventChart();
    chartEventsOptions.value = {
        data: res,
    };
});

const onSelectGroupBy = (payload: UiDropdownItem<string>) => {
    eventsStore.controlsGroupBy = payload.value;
};

const onSelectPerion = (payload: UiToggleGroupItem) => {
    eventsStore.controlsPeriod = payload.value;
};
</script>

<style lang="scss" scoped>
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
    }
}
</style>