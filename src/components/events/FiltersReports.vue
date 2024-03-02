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
    <FilterGroupsList />
  </UiCardBody>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCardTitle from '@/components/uikit/UiCard/UiCardTitle.vue'
import UiCardBody from '@/components/uikit/UiCard/UiCardBody.vue'
import FilterGroupsList from '@/components/funnels/filters/FilterGroupsList.vue'
import UiSwitch from '@/components/uikit/UiSwitch.vue'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import useConfirm from '@/hooks/useConfirm'
import usei18n from '@/hooks/useI18n'

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
          condition: 'and',
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

filterGroupsStore.$subscribe(mutation => {
  if (mutation.type === 'direct') {
    onChange()
  }
})
</script>
