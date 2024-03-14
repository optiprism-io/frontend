<template>
  <div class="ui-table">
    <DataEmptyPlaceholder
      v-if="showPlaceholder"
      :content="props?.noDataText || $t('common.noData')"
    />
    <div v-else-if="props.showToolbar" class="pf-c-toolbar ui-table-toolbar">
      <div class="pf-c-toolbar__content">
        <div class="pf-c-toolbar__content-section pf-m-nowrap">
          <div class="pf-c-toolbar__item">
            <div class="pf-l-flex pf-u-align-items-center">
              <slot name="before" />
              <UiSpinner v-show="props.isLoading" class="pf-u-ml-md" :size="'md'" />
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
              <template v-for="column in visibleColumns" :key="column.value">
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
            <tr v-for="(row, i) in visibleItems" :key="i" role="row">
              <template v-for="(cell, j) in row" :key="j">
                <UiTableCellWrapper
                  :fixed="cell.fixed"
                  :truncate="cell.truncate"
                  :last-fixed="cell.lastFixed"
                  :no-wrap="cell.nowrap"
                  :type="cell.type"
                >
                  <component
                    :is="cell.component || UiTableCell"
                    :action="cell.action"
                    :value="cell.value"
                    :title="cell.title"
                    :nowrap="cell.nowrap"
                    @on-action="onAction"
                  />
                </UiTableCellWrapper>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, useSlots, ref } from 'vue'
import { Row, Column, Action, ColumnGroup } from '@/components/uikit/UiTable/UiTable'
import UiTableHeadCell from '@/components/uikit/UiTable/UiTableHeadCell.vue'
import UiTableCell from '@/components/uikit/UiTable/UiTableCell.vue'
import UiTableCellWrapper from '@/components/uikit/UiTable/UiTableCellWrapper.vue'
import UiSelect, { UiSelectItem } from '@/components/uikit/UiSelect.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import { boolean } from 'valibot'

const i18n = inject<any>('i18n')
const slots = useSlots()

type Props = {
  showSelectColumns?: boolean
  compact?: boolean
  items?: Row[]
  columns: Column[]
  groups?: ColumnGroup[]
  isLoading?: boolean
  showToolbar?: boolean
  noDataTitle?: string
  noDataText?: string
  enablePlaceholder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  groups: () => [],
  compact: true,
  showSelectColumns: false,
  showToolbar: true,
  noDataTitle: '',
  noDataText: '',
  enablePlaceholder: true,
})

const emit = defineEmits<{
  (e: 'on-action', payload: Action): void
}>()

const disabledColumns = ref<{ [key: string]: boolean}>({})

const showPlaceholder = computed(
  () => props.enablePlaceholder && !props.isLoading && !props.items?.length
)
const columnsSelect = computed(() => {
  return props.showSelectColumns ? props.columns.reduce((acc: UiSelectItem<string>[], column) => {
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

const activeColumns = computed(() => {
  return props.columns.reduce((acc: string[], item) => {
    if (!disabledColumns.value[item.value]) {
        acc.push(item.value)
    }
    return acc
  }, [])
})

const columnsButtonText = computed(() => `${columnsSelect.value.length} ${i18n.$t('common.columns')}`)

const visibleColumns = computed(() => {
  return props.columns.filter(
    item =>
      !item.hidden &&
      (!props.showSelectColumns || item.default || !disabledColumns.value[item.value])
  )
})

const visibleColumnsKeys = computed(() => {
  return visibleColumns.value.map(col => col.value)
})

const visibleItems = computed(() => {
  return props.items.map(row => {
    return row.filter(
      cell => visibleColumnsKeys.value.includes(cell.key)
    )
  })
})

const onAction = (payload: Action) => {
  emit('on-action', payload)
}

const toggleColumns = (payload: string) => {
  disabledColumns.value[payload] = !disabledColumns.value[payload]
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
}

.ui-table-toolbar {
  position: sticky;
  left: 0;
}
</style>
