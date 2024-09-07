<template>
  <div class="time-window">
    <span class="pf-v5-l-flex__item">within</span>

    <UiSelectSize
      v-model="size"
      :items="sizeItems"
      @search="handleSizeSearch"
    >
      <UiButton class="pf-v5-m-secondary pf-v5-l-flex__item" :is-link="true">
        {{ stepsStore.size }}
      </UiButton>
    </UiSelectSize>

    <UiSelectUnit
      v-model="unit"
      :items="unitItems"
      :show-search="false"
    >
      <UiButton class="pf-v5-m-secondary pf-v5-l-flex__item" :is-link="true">
        {{ $t(`common.timeUnits.${stepsStore.unit}`) }}
      </UiButton>
    </UiSelectUnit>

    <span class="pf-v5-l-flex__item"> {{ $t('criteria.timeWindow') }} {{ $t('criteria.in') }} </span>

    <UiSelectOrder
      v-model="order"
      :items="orderItems"
      :show-search="false"
    >
      <UiButton class="pf-v5-m-secondary pf-v5-l-flex__item" :is-link="true">
        {{ $t(`criteria.orderType.${stepsStore.order}`) }}
      </UiButton>
    </UiSelectOrder>

    <span class="pf-v5-l-flex__item">order</span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import UiButton from '@/components/uikit/UiButton.vue'

import { FunnelQueryStepsInnerOrderOneOfTypeEnum, TimeUnit } from '@/api'
import { UiSelectGeneric } from '@/components/uikit/UiSelect/UiSelectGeneric'
import { useStepsStore } from '@/stores/funnels/steps'

import type { TimeUnitWithSession } from '@/api';
import type { UiSelectItemInterface } from '@/components/uikit/UiSelect/types'
import type { I18N } from '@/utils/i18n'

const UiSelectSize = UiSelectGeneric<number>()
const UiSelectUnit = UiSelectGeneric<TimeUnitWithSession>()
const UiSelectOrder = UiSelectGeneric<FunnelQueryStepsInnerOrderOneOfTypeEnum>()

const stepsStore = useStepsStore()
const i18n = inject<I18N>('i18n')

const dynamicSize = ref<number | null>(null)

const sizeRanges: Record<TimeUnit, [number, number]> = {
  hour: [1, 100],
  day: [1, 100],
  week: [1, 10],
  month: [1, 12],
  year: [1, 10],
}

const defaultSizes = computed(() => {
  const sizeRange = sizeRanges[stepsStore.unit]
  const [start, end] = sizeRange
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
})

const sizeItems = computed<UiSelectItemInterface<number>[]>(() => {
  const sizes = dynamicSize.value ? [dynamicSize.value, ...defaultSizes.value] : defaultSizes.value

  return sizes.map(item => {
    return {
      __type: 'item',
      id: item,
      label: `${item}`,
      value: item,
    }
  })
})

const unitItems = computed<UiSelectItemInterface<TimeUnit>[]>(() => {
  return Object.values(TimeUnit).map(item => ({
    __type: 'item',
    id: item,
    label: i18n?.$t(`common.timeUnits.${item}`) ?? item,
    value: item,
  }))
})

const orderItems = computed<UiSelectItemInterface<FunnelQueryStepsInnerOrderOneOfTypeEnum>[]>(() => {
  return Object.values(FunnelQueryStepsInnerOrderOneOfTypeEnum).map(item => ({
    __type: 'item',
    id: item,
    label: i18n?.$t(`criteria.orderType.${item}`) ?? item,
    value: item,
  }))
})

const size = computed({
  get(): number {
    return stepsStore.size
  },
  set(value: number) {
    stepsStore.setSize(value)
  },
})

const unit = computed({
  get(): TimeUnit {
    return stepsStore.unit
  },
  set(value: TimeUnit) {
    stepsStore.setUnit(value)
  },
})

const order = computed({
  get(): FunnelQueryStepsInnerOrderOneOfTypeEnum {
    return stepsStore.order
  },
  set(value: FunnelQueryStepsInnerOrderOneOfTypeEnum) {
    stepsStore.setOrder(value)
  },
})

const handleSizeSearch = (value: string) => {
  dynamicSize.value = null

  const parsedSize = Number(value)
  if (isNaN(parsedSize)) {
    return
  }

  if (defaultSizes.value.includes(parsedSize)) {
    return
  }

  dynamicSize.value = parsedSize
}
</script>

<style lang="scss" scoped>
.time-window {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-wrap: nowrap;
}
</style>
