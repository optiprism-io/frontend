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
                        >
                            <template #after>
                                <UiDatePicker
                                    :value="calendarValue"
                                    :last-count="eventsStore.period.last"
                                    :active-tab-controls="eventsStore.period.type"
                                    :controls-group-by="eventsStore.controlsGroupBy"
                                    @on-apply="onApplyPeriod"
                                >
                                    <template #action>
                                        <button
                                            class="pf-c-toggle-group__button"
                                            :class="{
                                                'pf-m-selected': calendarValueString,
                                            }"
                                            type="button"
                                        >
                                            <div class="pf-u-display-flex pf-u-align-items-center">
                                                <UiIcon :icon="'far fa-calendar-alt'" />
                                                &nbsp;
                                                {{ calendarValueString }}
                                            </div>
                                        </button>
                                    </template>
                                </UiDatePicker>
                            </template>
                        </UiToggleGroup>
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
import {groupByMap, periodMap} from "@/configs/events/controls";
import UiToggleGroup, {UiToggleGroupItem} from "@/components/uikit/UiToggleGroup.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import UiDatePicker, { ApplyPayload } from "@/components/uikit/UiDatePicker.vue";

const UiDropdown = GenericUiDropdown<string>();
const eventsStore = useEventsStore();
const chartEventsOptions = ref();

const calendarValue = computed(() => {
    return {
        from: eventsStore.period.from,
        to: eventsStore.period.to,
        multiple: false,
        dates: [],
    };
});

const calendarValueString = computed(() => {
    if (eventsStore.period.type === 'last' && eventsStore.period.from && eventsStore.period.to) {
        return `Last ${eventsStore.period.last} ${eventsStore.controlsGroupBy}`;
    } else {
        return '';
    }
});

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

const getCountAfterGroup = (type: string) => {
    switch (type) {
        case 'week':
            return 3
        case 'month':
            return 1
        default:
            return 7
    }
}

const onSelectGroupBy = (payload: UiDropdownItem<string>) => {
    eventsStore.period = {
        ...eventsStore.period,
        last: getCountAfterGroup(payload.value),
    };
    eventsStore.controlsGroupBy = payload.value;
};

const onSelectPerion = (payload: UiToggleGroupItem) => {
    eventsStore.controlsPeriod = payload.value;
    eventsStore.period = {
        ...eventsStore.period,
        from: '',
        to: '',
        last: getCountAfterGroup(eventsStore.controlsGroupBy),
        type: 'last',
    };
};

const onApplyPeriod = (payload: ApplyPayload): void => {
    eventsStore.controlsPeriod = 'calendar';
    eventsStore.period = {
        ...eventsStore.period,
        from: payload.value.from || '',
        to: payload.value.to || '',
        type: payload.type,
        last: payload.last,
    };
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