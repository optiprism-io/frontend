<template>
  <div class="pf-c-scroll-inner-wrapper">
    <UiTable :items="data" :columns="columns" :groups="columnGroups" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Column, ColumnGroup, Row } from '@/components/uikit/UiTable/UiTable'
import { DataTableResponseColumnsInner } from '@/api'
import { countBy } from 'lodash'

interface IProps {
  reports: DataTableResponseColumnsInner[]
}

const props = withDefaults(defineProps<IProps>(), {})

const columns = computed<Column[]>(() =>
  visibleReports.value.map(col => ({
    title: col.name,
    value: col.name,
    hidden: col.hidden,
  }))
)

const visibleReports = computed(() => props.reports.filter(x => !x.hidden))

const data = computed<Row[]>(() =>
  Array.from({ length: props.reports.at(0)?.data.length ?? 0 }, (_, index) =>
    props.reports.map(col => ({
      title: col.data[index],
      key: col.name,
    }))
  )
)

const columnGroups = computed<ColumnGroup[]>(() =>
  spanTuple.value.map(([name, count]) => ({
    title: name,
    value: name,
    span: count,
    fixed: true,
    lastFixed: true,
  }))
)

const spanTuple = computed<[string, number][]>(() => {
  const splitter = '-'

  const steps = visibleReports.value.map(x => x)
  const countsSteps = countBy(steps, step => {
    const stepId = step.stepId ?? -1
    const index = stepId + 1
    const name = step.step ?? ''
    return index + splitter + name
  })

  const entries = Object.entries(countsSteps)
  const data = entries.map(([key, val]) => {
    const [_, name] = key.split(splitter)
    return [name, val] as [string, number]
  })

  return data
})
</script>
