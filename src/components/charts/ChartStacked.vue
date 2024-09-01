<template>
  <div
    v-if="props.data?.[0]?.elements.length > 1 && !props.liteChart"
    class="legend"
  >
    <LegendMarker
      v-for="(item, j) in props.data?.[0]?.elements"
      :key="j"
      :marker-name="item.columnName"
      :color="getPseudoRandomColor(j)"
    />
  </div>
  <div class="chart-stacked">
    <div
      v-for="(group, i) in props.data"
      :key="i"
      class="chart-stacked__group"
    >
      <div class="chart-stacked__group-caption">
        {{ group.groupName }}
      </div>
      <div
        v-for="(bar, index) in group.elements"
        :key="index"
        class="chart-stacked__column"
        :style="{
          width: 100 / group.elements.length + '%',
          maxHeight: (props.data?.[i - 1]?.elements[index].primary.percentage || 100) + '%',
        }"
      >
        <div
          v-if="bar.primary.percentage"
          class="chart-stacked__column-caption"
        >
          <div>{{ bar.primary.value }}</div>
          <div class="chart-stacked__column-caption-b">
            {{ bar.primary.percentage.toFixed(0) }} %
          </div>
        </div>
        <div
          v-tooltip="{
            content: getTooltipContent(bar.columnName, bar.secondary),
            html: true,
          }"
          class="chart-stacked__column-el"
          :style="{
            background: lighten(getPseudoRandomColor(index)),
            height: getHeight(bar.secondary.value, bar.secondary.value + bar.primary.value) + '%',
          }"
        />
        <div
          v-tooltip="{
            content: getTooltipContent(bar.columnName, bar.primary),
            html: true,
          }"
          class="chart-stacked__column-el"
          :style="{
            background: getPseudoRandomColor(index),
            height: getHeight(bar.primary.value, bar.primary.value + bar.secondary.value) + '%',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VTooltip as vTooltip } from 'floating-vue'

import LegendMarker from '@/components/charts/LegendMarker.vue'

import { getPseudoRandomColor, lighten } from '@/utils/colorHelper'

import type { ChartElement, ChartStackedItem } from '@/components/charts/types'

interface IProps {
  data: ChartStackedItem[]
  height: string // ex. "20rem", "500px", "100%"
  liteChart?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  liteChart: false,
})

function getHeight(value: number, total: number): number {
  return (value / total) * 100
}

function getTooltipContent(groupName: string, el: ChartElement): string {
  return `
    <div>
      <div> ${groupName} </div>
      <div>${el.label}: ${el.value}</div>
      <div>${el.percentageLabel}: ${el.percentage} %</div>
    </div>
  `
}
</script>

<style lang="scss" scoped>
.chart-stacked {
  height: v-bind('props.height');

  display: flex;
  flex: 1 1 auto;
  justify-content: flex-start;
  gap: 2rem;
  padding: 4rem 1rem;
  position: relative;
  overflow-x: auto;
  font-size: var(--pf-v5-global--FontSize--sm);
  line-height: 1.5;
}

.chart-stacked__group {
  display: flex;
  align-items: end;
  align-self: stretch;
  gap: 0.5rem;
  height: 100%;
  position: relative;
  margin: auto;
  flex: 1 1 auto;
}

.chart-stacked__group-caption {
  text-align: center;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
}

.chart-stacked__column {
  height: 100%;
  text-align: center;
  position: relative;
  min-width: 3rem;
}

.chart-stacked__column-caption {
  text-align: left;
  line-height: 1;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
}

.chart-stacked__column-caption-b {
  white-space: nowrap;
}

.chart-stacked__column-el {
  &:hover {
    border: thin solid black;
  }
}

.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
