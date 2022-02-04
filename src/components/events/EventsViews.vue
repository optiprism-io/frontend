<template>
    <div class="pf-c-card">
        <div class="pf-c-toolbar">
            <div class="pf-c-toolbar__content">
                <div class="pf-c-toolbar__content-section pf-m-nowrap">
                    <div class="pf-c-toolbar__item">
                        <UiSelect
                            :items="itemsGroupBy"
                            :text-button="selectedGroupByString"
                            :selections="[eventsStore.controlsGroupBy]"
                            @on-select="onSelectGroupBy"
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
                                    :last-count="lastCount"
                                    :active-tab-controls="eventsStore.period.type"
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
                    <div class="pf-c-toolbar__item">
                        <UiSelect
                            :items="compareToItems"
                            :text-button="textSelectCompairTo"
                            :selections="[eventsStore.compareTo]"
                            :clearable="true"
                            :full-text="true"
                            @on-clear="onSelectCompareTo('')"
                            @on-select="onSelectCompareTo"
                        />
                    </div>
                    <div class="pf-c-toolbar__item pf-u-ml-auto">
                        <UiSelect
                            :items="chartTypeItems"
                            :selections="[eventsStore.chartType]"
                            :text-button="textSelectChartType"
                            @on-select="onSelectChartType"
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
import { ref, computed, onBeforeMount } from "vue";
import ChartWrapper from "@/components/charts/ChartWrapper.vue";
import UiSelect, { UiSelectItem } from "@/components/uikit/UiSelect.vue";
import { useEventsStore, compareToMap, ChartType, chartTypeMap } from "@/stores/eventSegmentation/events";
import eventService from "@/api/services/schema.service";
import { groupByMap, periodMap } from "@/configs/events/controls";
import UiToggleGroup, {UiToggleGroupItem} from "@/components/uikit/UiToggleGroup.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import UiDatePicker, { ApplyPayload } from "@/components/uikit/UiDatePicker.vue";
import { getStringDateByFormat } from "@/helpers/getStringDates";
import { firstChartUpper } from "@/helpers/stringConverts";

const eventsStore = useEventsStore();
const chartEventsOptions = ref();

const compareToItems = computed(() => {
    return compareToMap.map(item => {
        return {
            key: item,
            nameDisplay: `Previous ${item}`,
            value: item,
        }
    })
})
const textSelectCompairTo = computed(() => {
    return eventsStore.compareTo ? `Compare to previous ${eventsStore.compareTo}` : 'Compare to Past'
})


const chartTypeItems = computed(() => {
    return chartTypeMap.map((item, i): UiSelectItem<ChartType> => {
        return {
            key: `${item}-${i}`,
            nameDisplay: firstChartUpper(item),
            value: item,
        }
    })
})
const textSelectChartType = computed(() => {
    return `${firstChartUpper(eventsStore.chartType)} charts`
})

const perios = computed(() => {
    return eventsStore.period;
});

const lastCount = computed(() => {
    return perios.value.last;
});

const calendarValue = computed(() => {
    return {
        from: perios.value.from,
        to: perios.value.to,
        multiple: false,
        dates: [],
    };
});

const calendarValueString = computed(() => {
    if (eventsStore.period.from && eventsStore.period.to && eventsStore.controlsPeriod === 'calendar') {
        switch(eventsStore.period.type) {
            case 'last':
                return `Last ${eventsStore.period.last} ${eventsStore.period.last === 1 ? 'day' : 'days'}`;
            case 'since':
                return `Since ${getStringDateByFormat(eventsStore.period.from, '%d %b, %Y')}`;
            case 'between':
                return `${getStringDateByFormat(eventsStore.period.from, '%d %b, %Y')} - ${getStringDateByFormat(eventsStore.period.to, '%d %b, %Y')}`;
            default:
                return '';
        }
    } else {
        return '';
    }
});

const itemsGroupBy = computed(() => {
    return groupByMap.map((key) => ({
        key,
        nameDisplay: key,
        value: key,
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
    const selectedGroupBy = itemsGroupBy.value.find(item => item.value === eventsStore.controlsGroupBy);

    return selectedGroupBy ? `Group by ${selectedGroupBy.nameDisplay}` : '';
});

const onSelectGroupBy = (payload: string) => {
    eventsStore.initPeriod();
    eventsStore.controlsGroupBy = payload;
};

const onSelectPerion = (payload: UiToggleGroupItem) => {
    eventsStore.controlsPeriod = payload.value;
    eventsStore.initPeriod();
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

const onSelectCompareTo = (payload: string): void => {
    eventsStore.compareTo = payload;
};

const onSelectChartType = (payload: ChartType): void => {
    eventsStore.chartType = payload;
};

onBeforeMount(async () => {
    const res = await eventService.getEventChart();
    chartEventsOptions.value = {
        data: res,
    };
});
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