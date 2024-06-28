<template>
  <div
    id="container"
    class="container-class"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { Column } from '@antv/g2plot'

import { DEFAULT_SEPARATOR } from '@/constants'
import { uncamelize } from '@/utils/uncamelize'

import type { StepKey } from '@/components/funnels/view/funnelViews'

const data = [
  {
    groups: ['0', 'Macintosh'],
    total: 170,
    conversionRatio: 100,
    droppedOff: 0,
    dropOffRatio: 0,
    step: 'Product Added To Cart',
  },
  {
    groups: ['0', 'Android'],
    total: 36,
    conversionRatio: 100,
    droppedOff: 0,
    dropOffRatio: 0,
    step: 'Product Added To Cart',
  },
  {
    groups: ['0', 'iOS'],
    total: 28,
    conversionRatio: 100,
    droppedOff: 0,
    dropOffRatio: 0,
    step: 'Product Added To Cart',
  },
  {
    groups: ['0', 'Windows'],
    total: 112,
    conversionRatio: 100,
    droppedOff: 0,
    dropOffRatio: 0,
    step: 'Product Added To Cart',
  },
  {
    groups: ['0', 'Chrome OS'],
    total: 54,
    conversionRatio: 100,
    droppedOff: 0,
    dropOffRatio: 0,
    step: 'Product Added To Cart',
  },
  /* ----------- */
  {
    groups: ['0', 'Macintosh'],
    total: 112,
    conversionRatio: 66.795,
    droppedOff: 58,
    dropOffRatio: 33.205,
    step: 'Product Viewed',
  },
  {
    groups: ['0', 'Android'],
    total: 26,
    conversionRatio: 70.952,
    droppedOff: 10,
    dropOffRatio: 29.048,
    step: 'Product Viewed',
  },
  {
    groups: ['0', 'iOS'],
    total: 14,
    conversionRatio: 39.815,
    droppedOff: 14,
    dropOffRatio: 60.185,
    step: 'Product Viewed',
  },
  {
    groups: ['0', 'Windows'],
    total: 77,
    conversionRatio: 56.605,
    droppedOff: 35,
    dropOffRatio: 43.395,
    step: 'Product Viewed',
  },
  {
    groups: ['0', 'Chrome OS'],
    total: 35,
    conversionRatio: 57.956,
    droppedOff: 19,
    dropOffRatio: 42.044,
    step: 'Product Viewed',
  },
]

const primaryKeys: StepKey[] = ['total', 'droppedOff']

const dataView = computed(() => {
  return data
    .map((item, i) => {
      return Array.from({ length: primaryKeys.length }).map((_, j) => {
        const iterator = primaryKeys.length - 1 - j

        const primaryKey = primaryKeys[iterator]

        return {
          index: i,
          type: primaryKey,
          value: item[primaryKey],
          groupsName: item.groups.join(DEFAULT_SEPARATOR),
          step: item.step,
        }
      })
    })
    .flat()
})

// const groups = computed(() => {
//   return Array.from(new Set(dataView.value.map(item => item.groupsName)))
// })

// const legendItems = computed(() => {
//   return groups.value.map((item, index) => ({
//     name: item,
//     value: index,
//   }))
// })

onMounted(() => {
  const plot = new Column('container', {
    data: dataView.value,
    xField: 'step',
    yField: 'value',
    isGroup: true,
    isStack: true,
    seriesField: 'type',
    // seriesField: 'groupsName',
    groupField: 'groupsName',
    tooltip: {
      shared: false,
      showTitle: false,
      customItems(originalItems) {
        return originalItems.map(item => ({
          ...item,
          name: item.data.groupsName + ' ' + uncamelize(item.data.type),
        }))
      },
    },
    scrollbar: {
      type: 'horizontal',
    },
    label: {
      position: 'middle',
      formatter: item => item.value || undefined,
    },
    yAxis: {
      grid: null,
      label: null,
    },
    xAxis: {
      grid: null,
      line: null,
    },
    legend: {
      position: 'top',
      // items: legendItems.value,
    },
  })

  plot.render()
})
</script>

<style scoped lang="scss">
.container-class {
  width: 100%;
  height: 100vh;
}
</style>
