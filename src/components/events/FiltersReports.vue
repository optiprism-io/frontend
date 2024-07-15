<template>
  <UiCardTitle class="pf-u-pr-md">
    {{ $t('funnels.filters') }}
    <template v-if="isAllowAdvanced" #extra>
      <div class="pf-u-ml-lg" @mousedown="onBeforeChangeFiltersType">
        <UiSwitch
          :reverse="true"
          :value="isFiltersAdvanced"
          :label="$t('filters.advanced')"
          @input="onChangeFiltersType"
        />
      </div>
    </template>
  </UiCardTitle>
  <UiCardBody>
    <FilterGroupsList @input="onChange" />
  </UiCardBody>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import FilterGroupsList from '@/components/funnels/filters/FilterGroupsList.vue'
import UiCardBody from '@/components/uikit/UiCard/UiCardBody.vue'
import UiCardTitle from '@/components/uikit/UiCard/UiCardTitle.vue'
import UiSwitch from '@/components/uikit/UiSwitch.vue'

import { EventGroupedFiltersGroupsConditionEnum } from '@/api'
import useConfirm from '@/hooks/useConfirm'
import usei18n from '@/hooks/useI18n'
import { useFilterGroupsStore } from '@/stores/reports/filters'

export interface Props {
  isAllowAdvanced?: boolean
}

const filterGroupsStore = useFilterGroupsStore()
const { t } = usei18n()
const { confirm } = useConfirm()

const emit = defineEmits<{
  (e: 'on-change'): void
}>()

defineProps<Props>()

const isFiltersAdvanced = computed(() => filterGroupsStore.isFiltersAdvanced)

const onBeforeChangeFiltersType = async (e: Event) => {
  if (filterGroupsStore.isFiltersAdvanced && filterGroupsStore.filterGroups.length > 1) {
    e.preventDefault()

    try {
      await confirm(t('filters.resetText'), {
        applyButton: t('common.apply'),
        cancelButton: t('common.cancel'),
        title: '',
        applyButtonClass: 'pf-m-danger',
      })

      filterGroupsStore.isFiltersAdvanced = false
      filterGroupsStore.filterGroups = [
        {
          condition: EventGroupedFiltersGroupsConditionEnum.And,
          filters: [],
        },
      ]
    } catch (e) {
      filterGroupsStore.isFiltersAdvanced = true
    }
  }
}

const onChangeFiltersType = () => {
  filterGroupsStore.isFiltersAdvanced = !filterGroupsStore.isFiltersAdvanced
}

const onChange = () => {
  emit('on-change')
}
</script>
