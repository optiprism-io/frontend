<template>
  <div class="funnel-chart-stacked pf-v5-l-flex pf-v5-m-column pf-v5-u-text-align-center">
    <div
      ref="container"
      class="pf-v5-l-flex__item"
    />
    <div
      class="pf-v5-u-font-weight-bold pf-v5-l-flex__item"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import { Chart, getEngine } from '@antv/g2'

import { DEFAULT_SEPARATOR } from '@/constants'
import { getPseudoRandomColor, lighten } from '@/utils/colorHelper'
import { humanReadable } from '@/utils/humanReadable'
import { toFixedFormat } from '@/utils/toFixedFormat'
import { uncamelize } from '@/utils/uncamelize'

import type { StepKey } from '@/components/funnels/view/funnelViews'

const G = getEngine('canvas')
const container = ref<HTMLDivElement | null>(null)
const chart = ref<Chart | null>(null)

interface IProps {
  data: Record<string, any>[]
  width?: number
  height?: number
  colors?: string[]
  liteChart?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  width: 400,
  height: 500,
  colors: () => [],
  liteChart: false,
})

const xKey = 'dimension'
const primaryKeys: StepKey[] = ['total', 'droppedOff']
const secondaryKeys: StepKey[] = ['conversionRatio', 'dropOffRatio']
const labelKey: StepKey = 'droppedOff'

const dataView = computed(() => {
  return props.data
    .map((item, i) => {
      return Array.from({ length: primaryKeys.length }).map((_, j) => {
        const iterator = primaryKeys.length - 1 - j

        const primaryKey = primaryKeys[iterator]
        const secondaryKey = secondaryKeys[iterator]

        const color = props.colors[i]
          ? lighten(props.colors[i], iterator * 80)
          : getPseudoRandomColor(i)

        let primaryValue = item[primaryKey]
        let secondaryValue = item[secondaryKey]
        if (typeof primaryValue === 'number') {
          primaryValue = +toFixedFormat(primaryValue)
        }
        if (typeof secondaryValue === 'number') {
          secondaryValue = +toFixedFormat(secondaryValue)
        }

        return {
          index: i,
          [xKey]: item.groups.join(DEFAULT_SEPARATOR),
          primaryKey,
          secondaryKey,
          primaryValue,
          secondaryValue,
          color,
        }
      })
    })
    .flat()
})

const update = () => {
  if (!container.value) {
    return
  }

  if (chart.value) {
    chart.value.destroy()
  }

  chart.value = new Chart({
    container: container.value as HTMLElement,
    height: props.height,
    width: props.width,
    autoFit: true,
    padding: [50, 30, 0, 30],
    renderer: 'canvas',
  })

  chart.value
    .animate(false)
    .legend(false)
    .tooltip({
      customItems: originalItems => {
        const [item] = originalItems
        const { primaryKey, secondaryKey, primaryValue, secondaryValue } = item.data as Record<
          string,
          string
        >

        const secondaryBlock =
          secondaryKey && secondaryValue
            ? [
                {
                  ...item,
                  name: uncamelize(secondaryKey),
                  value: secondaryValue + '%',
                },
              ]
            : []

        return [
          {
            ...item,
            name: uncamelize(primaryKey),
            value: primaryValue,
          },
          ...secondaryBlock,
        ]
      },
      showMarkers: false,
      domStyles: {
        'g2-tooltip': {
          textAlign: 'left',
        },
        'g2-tooltip-title': {
          fontWeight: 'bold',
        },
      },
    })
    .data(dataView.value)
    .axis(xKey, false)
    .axis('primaryValue', false)
    .interval({ intervalPadding: 20 })
    .adjust('stack')
    .color('color', color => color)
    .position(`${xKey}*primaryValue`)
    .label('primaryValue', () => {
      return {
        position: 'top',
        offset: 0,
        content: data => {
          const size = props.liteChart ? 10 : 14

          const commonProps = {
            textAlign: 'left',
            fontSize: size,
            fontFamily: 'RedHatText',
            textBaseline: 'top',
          }

          const numberProps = {
            ...commonProps,
            fontWeight: 400,
            fill: '#000000',
          }

          const percentageProps = {
            ...commonProps,
            fontWeight: 600,
          }

          const { index: indexUnknown, primaryKey: primaryKeyUnknown } = data as Record<
            string,
            string | number
          >
          const index = Number(indexUnknown)
          const primaryKey = String(primaryKeyUnknown)
          const dataItem = props.data[index]

          if (primaryKey !== labelKey || !dataItem) {
            return ''
          }

          const { total, conversionRatio } = dataItem
          const text = humanReadable(total)
          const conversionRatioText = toFixedFormat(conversionRatio) + '%'

          const group = new G.Group({})

          if (+total > 0) {
            group.addShape({
              type: 'text',
              attrs: {
                x: 0,
                y: -size,
                text,
                ...numberProps,
              },
            })
          }

          if (+conversionRatio > 0) {
            group.addShape({
              type: 'text',
              attrs: {
                x: 0,
                y: 0,
                text: conversionRatioText,
                fill: '#000000',
                ...percentageProps,
              },
            })
          }

          return group
        },
      }
    })

  chart.value.render()
}

watch(
  () => [container.value, dataView.value],
  () => {
    update()
  }
)

watch(
  () => props.height,
  height => {
    if (chart.value) {
      chart.value.changeSize(props.width, height)
    }
  },
  { immediate: true }
)

watch(
  () => props.width,
  width => {
    if (chart.value) {
      chart.value.changeSize(width, props.height)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.funnel-chart-stacked {
  text-align: center;
}
</style>
