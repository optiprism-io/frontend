<template>
  <div
    class="events-views"
    :class="{
      'pf-c-card': !props.onlyView,
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
                      <span class="pf-c-toggle-group__icon pf-c-toggle-group__text">
                        <UiIcon icon="far fa-calendar-alt" />
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
          <div class="pf-c-toolbar__item pf-u-ml-auto">
            <UiLabelGroup :label="chartTypeLabel">
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
      :content="$t('common.noData')"
    />
    <div
      v-else
      :class="{
        'pf-u-p-md': !props.onlyView,
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
    class="events-views__table pf-c-card pf-u-mt-md"
  >
    <UiDataTable
      :columns="columns"
      :data="data"
      :bordered="false"
      :bottom-bordered="false"
      :virtual-scroll="true"
      :max-height="500"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useDateFormat } from '@vueuse/core'

import ChartColumn from '@/components/charts/ChartColumn.vue'
import ChartLine from '@/components/charts/ChartLine.vue'
import ChartPie from '@/components/charts/ChartPie.vue'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import UiDataTable from '@/components/uikit/UiDataTable.vue'
import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiLabelGroup from '@/components/uikit/UiLabelGroup.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup/UiToggleGroup.vue'

import { DataType } from '@/api'
import { groupByMap, periodMap } from '@/configs/events/controls'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import { getQueryFormattedValue } from '@/helpers/reportTableHelper'
import useDataTable from '@/hooks/useDataTable'
import usei18n from '@/hooks/useI18n'
import { useEventsStore } from '@/stores/eventSegmentation/events'

import type { DataTableResponse, DataTableResponseColumnsInner, Report, TimeUnit } from '@/api'
import type { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup/types'
import type { ChartType } from '@/stores/eventSegmentation/events'
import type { TableColumn, TableColumns } from 'naive-ui/es/data-table/src/interface'

interface ChartDropdownMap {
  value: ChartType
  icon: string
}

type Props = {
  eventSegmentation?: DataTableResponse | null
  loading?: boolean
  onlyView?: boolean
  chartType?: ChartType
  heightChart?: number
  liteChart?: boolean
  report?: Report | null
}

const props = withDefaults(defineProps<Props>(), {
  eventSegmentation: null,
  loading: false,
  chartType: undefined,
  heightChart: undefined,
  report: null,
})

const emit = defineEmits<{
  (e: 'on-change'): void
}>()

const chartTypeMap: ChartDropdownMap[] = [
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
]

const eventsStore = useEventsStore()
const { t } = usei18n()

type CellData = number | string | boolean

type RowData = {
  [key: string]: CellData
}

const columns = computed(() => {
  return (
    props.eventSegmentation?.columns?.reduce((acc: TableColumns, item) => {
      const column: TableColumn = {
        key: item.name,
        title: item.name,
      }

      if (item.type === 'dimension') {
        column.fixed = 'left'
        column.width = 150
      } else {
        column.ellipsis = true
        column.width = 200
      }

      if (item.name !== 'Segment') {
        acc.push(column)
      }
      return acc
    }, []) || []
  )
})

const data = computed(() => {
  const tableData: RowData[] = []

  ;(props.eventSegmentation?.columns || []).forEach(column => {
    if (column.data?.length) {
      column.data.forEach((item, indexData) => {
        if (!tableData[indexData]) {
          tableData[indexData] = {
            key: indexData,
          }
        }
        let value: CellData = item || 0

        if (column.dataType === DataType.Timestamp && item) {
          value = useDateFormat(+item, 'YYYY-MM-DD HH:mm')?.value
        }

        tableData[indexData][column.name] = value
      })
    }
  })

  return tableData
})

const dataTable = computed(() => {
  const columns: DataTableResponseColumnsInner[] = Object.values(
    (props.eventSegmentation?.columns || []).reduce(
      (acc: { [key: string]: DataTableResponseColumnsInner }, item) => {
        if (item.name === 'segment' && !props.report?.query?.segments?.length) {
          return acc
        }

        if (item.name === 'agg_name' && acc.event) {
          acc.event = {
            ...acc.event,
            data: acc.event.data.map(
              (value, i) => `${value} ${item.data[i] ? `(${item.data[i]})` : ''}`
            ),
          }
        } else {
          acc[item.name] = item
        }
        return acc
      },
      {}
    )
  )

  const table = useDataTable(columns ? { columns } : {}, true)

  table.tableData = table.tableData.map(row => {
    return row.map(cell => {
      if (cell.key === 'agg_name' && typeof cell.value === 'string' && props.report) {
        cell.title = getQueryFormattedValue(cell.value, props.report) || cell.value
      }

      return cell
    })
  })

  return table
})

const isNoData = computed(() => !props.loading && !props.eventSegmentation?.columns?.length)
const chartTypeActive = computed(() => props.chartType ?? eventsStore.chartType)
const chartTypeLabel = computed(() => `${t('common.chartType')}:`)
const isShowTable = computed(() => !isNoData.value && !props.onlyView)

const chartEventsOptions = computed(() => {
  switch (chartTypeActive.value) {
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
            formatter: (v: number) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
          },
        },
      }
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
      }
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
      }
    default:
      return {}
  }
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
  return eventsStore.period
})

const lastCount = computed(() => {
  return period.value.last
})

const calendarValue = computed(() => {
  return {
    from: period.value.from,
    to: period.value.to,
    multiple: false,
    dates: [],
  }
})

const calendarValueString = computed(() => {
  if (
    eventsStore.period.from &&
    eventsStore.period.to &&
    eventsStore.controlsPeriod === 'calendar'
  ) {
    switch (eventsStore.period.type) {
      case 'last':
        return `Last ${eventsStore.period.last} ${eventsStore.period.last === 1 ? 'day' : 'days'}`
      case 'since':
        return `Since ${getStringDateByFormat(eventsStore.period.from, '%d %b, %Y')}`
      case 'between':
        return `${getStringDateByFormat(eventsStore.period.from, '%d %b, %Y')} - ${getStringDateByFormat(eventsStore.period.to, '%d %b, %Y')}`
      default:
        return ''
    }
  } else {
    return ''
  }
})

const itemsGroupBy = computed(() => {
  return groupByMap.map(key => ({
    key,
    nameDisplay: key,
    value: key,
  }))
})

const itemsPeriod = computed(() => {
  const activeKey: string = eventsStore.controlsGroupBy
  const config = periodMap.find(item => item.type === activeKey)

  if (config) {
    return config.items.map(
      (key, i): UiToggleGroupItem<string> => ({
        key,
        nameDisplay: key + config.text,
        value: key,
        selected: eventsStore.controlsGroupBy ? key === eventsStore.controlsPeriod : i === 0,
      })
    )
  } else {
    return []
  }
})

const selectedGroupByString = computed(() => {
  const selectedGroupBy = itemsGroupBy.value.find(
    item => item.value === eventsStore.controlsGroupBy
  )

  return selectedGroupBy ? `Group by ${selectedGroupBy.nameDisplay}` : ''
})

const onSelectGroupBy = (payload: string) => {
  eventsStore.controlsGroupBy = payload as TimeUnit
  if (eventsStore.controlsPeriod !== 'calendar') {
    eventsStore.controlsPeriod = itemsPeriod.value[itemsPeriod.value.length - 1].value
  }
  updateEventSegmentationData()
}

const onSelectPerion = (payload: string) => {
  eventsStore.controlsPeriod = payload
  updateEventSegmentationData()
}

const onApplyPeriod = (payload: ApplyPayload): void => {
  eventsStore.controlsPeriod = 'calendar'
  eventsStore.period = {
    ...eventsStore.period,
    from: payload.value.from || '',
    to: payload.value.to || '',
    type: payload.type,
    last: payload.last,
  }
  updateEventSegmentationData()
}

const onSelectChartType = (payload: ChartType): void => {
  eventsStore.chartType = payload
}

const updateEventSegmentationData = async () => {
  if (eventsStore.hasSelectedEvents) {
    emit('on-change')
  }
}
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
