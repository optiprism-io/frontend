<template>
  <div class="pf-c-card pf-u-p-md">
    <div class="pf-c-toolbar">
      <div class="pf-c-toolbar__content">
        <div class="pf-c-toolbar__content-section pf-m-nowrap">
          <slot name="toolbar" />

          <UiDropdown
            class="pf-u-ml-auto"
            :items="FUNNEL_VIEWS"
            :text-button="itemText"
            @select-value="selectItem"
          />
        </div>
      </div>
    </div>

    <slot name="chart" />
  </div>

  <div class="pf-c-card pf-u-mt-md">
    <slot name="table" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import UiDropdown from '@/components/uikit/UiDropdown.vue'

import { FUNNEL_VIEWS } from '@/pages/reports/funnelViews'

import type { FunnelChartType } from '@/pages/reports/funnelViews'

interface IProps {
  funnelView: FunnelChartType
}

const props = withDefaults(defineProps<IProps>(), {})

const emit = defineEmits<{
  (e: 'change-view', payload: FunnelChartType): void
}>()

const itemText = computed(
  () => FUNNEL_VIEWS.find(c => c.value === props.funnelView)?.nameDisplay ?? ''
)

const selectItem = (value: UiDropdownItem<FunnelChartType>) => {
  emit('change-view', value.value)
}
</script>
