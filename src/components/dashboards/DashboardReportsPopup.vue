<template>
  <UiPopupWindow
    :title="$t('reports.selectReport')"
    :cancel-button="$t('common.close')"
    @cancel="emit('cancel')"
  >
    <div>
      <UiSpinner v-if="loading" />
      <UiTable
        v-else
        :show-toolbar="false"
        :items="itemsReport"
        :columns="columns"
        @on-action="onActionReport"
      />
    </div>
  </UiPopupWindow>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue'

import usei18n from '@/hooks/useI18n'

import type { Report } from '@/api'
import type { Action, Row } from '@/components/uikit/UiTable/UiTable'

const { t } = usei18n()

type Props = {
  reports: Report[]
  loading: boolean
}

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'on-select-report', id: number): void
}>()

const props = defineProps<Props>()

const itemsReport = computed(() => {
  if (props.reports.length) {
    return props.reports.map((item): Row => {
      return [
        {
          key: 'name',
          title: item.name ?? '',
          value: item.id,
          component: UiTablePressedCell,
          action: {
            type: item.id,
            name: item.name ?? '',
          },
        },
        {
          key: 'description',
          title: item.description ?? '',
          nowrap: true,
        },
      ]
    })
  } else {
    return []
  }
})

const columns = computed(() => {
  return [
    {
      value: 'name',
      title: t('dashboards.report.columns.name'),
    },
    {
      value: 'description',
      title: t('dashboards.report.columns.description'),
    },
  ]
})

const onActionReport = (payload: Action) => {
  emit('on-select-report', Number(payload.type))
}
</script>

<style lang="scss"></style>
