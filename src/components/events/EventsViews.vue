<template>
    <div
        class="events-views"
        :class="{
            'pf-c-card': !props.onlyView,
            'pf-u-mb-md': !props.onlyView,
        }"
    >
        <div
            v-if="!props.onlyView"
            class="pf-c-toolbar"
        >
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
                                            <span
                                                class="pf-c-toggle-group__icon pf-c-toggle-group__text"
                                            >
                                                <UiIcon :icon="'far fa-calendar-alt'" />
                                            </span>
                                            <span
                                                v-if="calendarValueString"
                                                class="pf-c-toggle-group__text"
                                            >
                                                {{ calendarValueString }}
                                            </span>
                                        </button>
                                    </template>
                                </UiDatePicker>
                            </template>
                        </UiToggleGroup>
                    </div>
                    <div class="pf-c-toolbar__item">
                        <UiSelect
                            :items="compareToItems"
                            :text-button="textSelectCompareTo"
                            :selections="[eventsStore.compareTo]"
                            :clearable="true"
                            :full-text="true"
                            @on-clear="onSelectCompareTo('')"
                            @on-select="onSelectCompareTo"
                        />
                    </div>
                    <div class="pf-c-toolbar__item pf-u-ml-auto">
                        <UiLabelGroup
                            :label="chartTypeLabel"
                        >
                            <template #content>
                                <UiToggleGroup
                                    :items="chartTypeItems"
                                    @select="onSelectChartType"
                                />
                            </template>
                        </UiLabelGroup>
                    </div>
                </div>
            </div>
        </div>
        <DataEmptyPlaceholder
            v-if="isNoData"
            :content="$t('common.noData') "
        />
        <div
            v-else
            :class="{
                'pf-u-p-md': !props.onlyView
            }"
        >
            <ChartPie
                v-if="chartEventsOptions.component === 'ChartPie'"
                :options="chartEventsOptions"
                :loading="props.loading"
            />
            <ChartColumn
                v-else-if="chartEventsOptions.component === 'ChartColumn'"
                :options="chartEventsOptions"
                :loading="props.loading"
            />
            <ChartLine
                v-else-if="chartEventsOptions.component === 'ChartLine'"
                :options="chartEventsOptions"
                :loading="props.loading"
            />
        </div>
    </div>
    <div
        v-if="isShowTable"
        class="events-views__table pf-c-card"
    >
        <UiTable
            :is-loading="props.loading"
            :items="dataTable.tableData"
            :columns="dataTable.tableColumnsValues"
        >
            <template #before>
                <div class="pf-u-font-size-lg">
                    {{ $t('events.breakdownTable') }}
                </div>
            </template>
        </UiTable>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useEventsStore, ChartType } from '@/stores/eventSegmentation/events';
import { groupByMap, periodMap } from '@/configs/events/controls';
import { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar';
import { getStringDateByFormat } from '@/helpers/getStringDates';
import { DataTableResponse, TimeUnit } from '@/api';
import useDataTable from '@/hooks/useDataTable';
import usei18n from '@/hooks/useI18n';
import UiSelect from '@/components/uikit/UiSelect.vue';
import UiToggleGroup, { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup.vue';
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue';
import UiIcon from '@/components/uikit/UiIcon.vue';
import UiDatePicker from '@/components/uikit/UiDatePicker.vue';
import UiLabelGroup from '@/components/uikit/UiLabelGroup.vue';
import UiTable from '@/components/uikit/UiTable/UiTable.vue';
import ChartPie from '@/components/charts/ChartPie.vue';
import ChartLine from '@/components/charts/ChartLine.vue';
import ChartColumn from '@/components/charts/ChartColumn.vue';

const compareToMap = ['day', 'week', 'month', 'year'];

const chartTypeMap = [
    {
        value: 'line',
        icon: 'fas fa-chart-line',
    },
    {
        value: 'column',
        icon: 'fas fa-chart-bar',
    },
    {
        value: 'pie',
        icon: 'fas fa-chart-pie',
    },
];

const eventsStore = useEventsStore();
const { t } = usei18n();

type Props = {
    eventSegmentation?: DataTableResponse | undefined
    loading: boolean
    onlyView?: boolean
    chartType?: ChartType
    heightChart?: number
    liteChart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    eventSegmentation: undefined,
    loading: false,
})

const dataTable = computed(() => useDataTable(props.eventSegmentation || {}, true))

const emit = defineEmits<{
    (e: 'get-event-segmentation'): void
}>()

const isNoData = computed(() => !props.loading && !dataTable.value.hasData)
const chartTypeActive = computed(() => props.chartType ?? eventsStore.chartType)
const chartTypeLabel = computed(() => `${t('common.chartType')}:`);
const isShowTable = computed(() => (!isNoData.value && !props.onlyView));

const chartEventsOptions = computed(() => {
    switch(chartTypeActive.value) {
        case 'line':
            return {
                data: dataTable.value.lineChart,
                height: props.heightChart ?? 350,
                component: 'ChartLine',
                xField: 'date',
                yField: 'value',
                seriesField: 'category',
                xAxis: {
                    type: 'time',
                },
                yAxis: {
                    label: {
                        formatter: (v: number) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                    },
                },
            };
        case 'pie':
            return {
                data: dataTable.value.pieChart,
                height: props.heightChart ?? 350,
                component: 'ChartPie',
                appendPadding: 10,
                angleField: 'value',
                colorField: 'type',
                radius: 0.8,
                label: {
                    type: 'outer',
                    content: '{name} {percentage}',
                },
                interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            };
        case 'column':
            return {
                data: dataTable.value.pieChart,
                height: props.heightChart ?? 350,
                component: 'ChartColumn',
                xField: 'type',
                yField: 'value',
                seriesField: 'type',
                intervalPadding: 15,
                maxColumnWidth: 45,
            };
        default:
            return {};
    }
});

const compareToItems = computed(() => {
    return compareToMap.map(item => {
        return {
            key: item,
            nameDisplay: `Previous ${item}`,
            value: item,
        }
    })
})

const textSelectCompareTo = computed(() => {
    return eventsStore.compareTo ? `Compare to previous ${eventsStore.compareTo}` : 'Compare to Past'
})

const chartTypeItems = computed(() => {
    return chartTypeMap.map((item, i) => {
        return {
            key: `${item.value}-${i}`,
            iconAfter: item.icon,
            nameDisplay: '',
            selected: chartTypeActive.value === item.value,
            value: item.value,
        }
    })
})

const period = computed(() => {
    return eventsStore.period;
});

const lastCount = computed(() => {
    return period.value.last;
});

const calendarValue = computed(() => {
    return {
        from: period.value.from,
        to: period.value.to,
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
    eventsStore.controlsGroupBy = payload as TimeUnit;
    eventsStore.controlsPeriod = itemsPeriod.value[itemsPeriod.value.length - 1].value;
    updateEventSegmentationData();
};

const onSelectPerion = (payload: string) => {
    eventsStore.controlsPeriod = payload;
    eventsStore.initPeriod();
    updateEventSegmentationData();
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
    updateEventSegmentationData();
};

const onSelectCompareTo = (payload: string): void => {
    eventsStore.compareTo = payload
}

const onSelectChartType = (payload: string): void => {
    eventsStore.chartType = payload;
}

const updateEventSegmentationData = async () => {
    if (eventsStore.hasSelectedEvents) {
        emit('get-event-segmentation')
    }
}
</script>

<style lang="scss">
.content-info {
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__icons {
        margin-bottom: 25px;
        font-size: 38px;
    }

    &__icon {
        margin: 0 15px;
    }
}

.events-views {
    &__table {
        .ui-table-cell {
            min-width: 100px;
        }
    }
    .pf-c-toggle-group__button {
        min-width: 38px;

    }
}
</style>