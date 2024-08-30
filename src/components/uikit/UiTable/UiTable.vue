<template>
  <div
    class="ui-table"
    :class="{
      'ui-table_clickable': allowClickCell
    }"
  >
    <div v-if="props.showToolbar" class="pf-c-toolbar ui-table-toolbar">
      <div class="pf-c-toolbar__content">
        <div class="pf-c-toolbar__content-section pf-m-nowrap">
          <div class="pf-c-toolbar__item">
            <div class="pf-l-flex pf-u-align-items-center">
              <slot name="before" />
              <UiSpinner
                v-show="props.isLoading"
                class="pf-u-ml-md"
                :size="'md'"
              />
            </div>
          </div>
          <div v-if="slots.after" class="pf-c-toolbar__item pf-u-ml-auto">
            <slot name="after" />
          </div>
          <div v-if="props.showSelectColumns" class="pf-c-toolbar__item pf-u-ml-auto">
            <UiSelect
              :items="columnsSelect"
              :variant="'multiple'"
              :text-button="columnsButtonText"
              :selections="activeColumns"
              @on-select="toggleColumns"
            />
          </div>
        </div>
      </div>
    </div>
    <DataEmptyPlaceholder
      v-if="showPlaceholder"
      :content="props?.noDataText || $t('common.noData')"
    />
    <div v-if="props.items?.length" class="pf-c-scroll-outer-wrapper">
      <div class="pf-c-scroll-inner-wrapper">
        <table
          class="pf-c-table"
          :class="{
            'pf-m-compact': props.compact,
          }"
          role="grid"
        >
          <thead>
            <tr v-if="groups.length > 0" role="row">
              <template v-for="group in groups" :key="group.value">
                <UiTableCellWrapper
                  :fixed="group.fixed"
                  :last-fixed="group.lastFixed"
                  :colspan="group.span"
                  :no-wrap="group.nowrap"
                  :is-head-cell="true"
                >
                  <UiTableHeadCell :value="group.value" :title="group.title" />
                </UiTableCellWrapper>
              </template>
            </tr>
            <tr role="row">
              <template v-for="column in columns" :key="column.value">
                <UiTableCellWrapper
                  :fixed="column.fixed"
                  :sorted="column.sorted"
                  :truncate="column.truncate"
                  :last-fixed="column.lastFixed"
                  :fit-content="column.fitContent"
                  :type="column.type"
                  :no-wrap="column.nowrap"
                  :is-head-cell="true"
                >
                  <UiTableHeadCell
                    :value="column.value"
                    :title="column.title"
                    :sorted="column.sorted"
                  />
                </UiTableCellWrapper>
              </template>
            </tr>
          </thead>
          <tbody role="rowgroup">
            <tr
              v-for="(row, i) in items"
              :key="i"
              role="row"
            >
              <UiTableCellWrapper
                v-for="(cell, j) in row"
                :key="j"
                :fixed="cell.fixed"
                :truncate="cell.truncate"
                :last-fixed="cell.lastFixed"
                :no-wrap="cell.nowrap"
                :type="cell.type"
                @click="clickCell(cell, i)"
              >
                <Component
                  :is="cell.component || UiTableCell"
                  :action="cell.action"
                  :value="cell.value"
                  :title="cell.title"
                  :nowrap="cell.nowrap"
                  :items="cell.items"
                  :type="cell.type"
                  @on-action="onAction"
                />
              </UiTableCellWrapper>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, useSlots, ref, onBeforeMount } from 'vue'

import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import type { UiSelectItem } from '@/components/uikit/UiSelect.vue';
import UiSelect from '@/components/uikit/UiSelect.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiTableCell from '@/components/uikit/UiTable/UiTableCell.vue'
import UiTableCellWrapper from '@/components/uikit/UiTable/UiTableCellWrapper.vue'
import UiTableHeadCell from '@/components/uikit/UiTable/UiTableHeadCell.vue'

import type { Row, Cell, Column, Action, ColumnGroup } from '@/components/uikit/UiTable/UiTable'

const i18n = inject<any>('i18n')
const slots = useSlots()

type Props = {
  showSelectColumns?: boolean
  compact?: boolean
  items?: Row[]
  columns: Column[]
  filterColumns?: Column[]
  groups?: ColumnGroup[]
  isLoading?: boolean
  showToolbar?: boolean
  noDataTitle?: string
  noDataText?: string
  enablePlaceholder?: boolean
  defaultColumns?: string[]
  allowClickCell?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  filterColumns: () => [],
  groups: () => [],
  compact: true,
  showSelectColumns: false,
  showToolbar: true,
  noDataTitle: '',
  noDataText: '',
  enablePlaceholder: true,
  defaultColumns: () => [],
})

const emit = defineEmits<{
  (e: 'click-cell', call: Cell, rowIndex: number): void
  (e: 'on-action', payload: Action): void
  (e: 'select-columns', payload: string[]): void
}>()

const activeColumns = ref<string[]>([])

const showPlaceholder = computed(
  () => props.enablePlaceholder && !props.isLoading && !props.items?.length
)

const columnsSelect = computed(() => {
  return props.showSelectColumns ? (props.filterColumns || []).reduce((acc: UiSelectItem<string>[], column) => {
    if (!column.default) {
      acc.push({
        key: column.value,
        nameDisplay: column.title,
        value: column.value,
      })
    }
    return acc
  }, []) : []
})

const columnsButtonText = computed(() => `${activeColumns.value.length} ${i18n.$t('common.columns')}`)

const onAction = (payload: Action) => {
  emit('on-action', payload)
}

const toggleColumns = (payload: string) => {
  activeColumns.value = activeColumns.value.includes(payload) ?
    activeColumns.value.filter(item => item !== payload) :
    [...activeColumns.value, payload]

  emit('select-columns', activeColumns.value)
}

onBeforeMount(() => {
  activeColumns.value = props.defaultColumns || props.columns.map(item => item.value)
})

const clickCell = (cell: Cell, rowIndex: number) => {
  emit('click-cell', cell, rowIndex);
}
</script>

<style lang="scss">
.ui-table {
  .pf-c-toolbar__content {
    min-height: 34px;
  }
  .pf-c-table {
    --pf-c-table__sticky-column--cell-min-width--base: 4rem;
  }
  .pf-c-scroll-outer-wrapper {
    min-height: auto;
  }

  &_clickable {
    tr:hover {
      background-color: rgba(247, 247, 250, 1);
      cursor: pointer;
    }
  }
}

.ui-table-toolbar {
  position: sticky;
  left: 0;
}
</style>
