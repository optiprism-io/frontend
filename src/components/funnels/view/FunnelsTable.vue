<template>
  <div class="pf-c-scroll-inner-wrapper">
    <UiTable :items="data" :columns="FUNNEL_COLUMNS" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Cell, Row } from '@/components/uikit/UiTable/UiTable'
import type { FunnelResponseStepsInner } from '@/api'
import { FUNNEL_COLUMNS } from '@/components/funnels/view/funnelViews'

interface IProps {
  reportSteps: FunnelResponseStepsInner[]
}

const props = withDefaults(defineProps<IProps>(), {})

const flatSteps = computed(() => {
  const steps: Record<string, any>[] = []

  props.reportSteps.forEach(x => {
    x.data.forEach(y => {
      const newObj = {
        ...y,
        step: x.step,
      }
      steps.push(newObj)
    })
  })

  return steps
})

const data = computed<Row[]>(() =>
  flatSteps.value.map(step =>
    FUNNEL_COLUMNS.map(col => {
      const title = step[col.value] as Cell['title']
      const key = col.value

      return { title, key }
    })
  )
)
</script>
