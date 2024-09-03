<template>
  <div class="pf-m-display-lg pf-u-min-width">
    <div class="pf-c-menu pf-m-plain pf-m-scrollable">
      <ul class="pf-c-menu__list">
        <li
          v-for="item in itemsTabs"
          :key="item.value"
          class="pf-c-menu__item"
          :class="{
            'pf-c-menu__list-item--selected': item.active,
          }"
          @mouseover="onSelectTab(item.value)"
        >
          <div class="pf-c-menu__item-main">
            <span class="pf-c-menu__item-text">{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import { TimeTypeEnum } from '@/helpers/periodHelper'

interface Props {
  activeTab: string
  showEach?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'on-select-tab', payload: TimeTypeEnum): void
}>()

const { t } = useI18n()

const tabsMap = Object.values(TimeTypeEnum)

const itemsTabs = computed(() => {
  const items = props.showEach ? tabsMap : tabsMap.filter(item => item !== 'each')

  return items.map(item => {
    return {
      value: item,
      name: t(`common.calendar.${item}`),
      active: props.activeTab === item,
    }
  })
})

const onSelectTab = (value: TimeTypeEnum) => {
  emit('on-select-tab', value)
}
</script>
