<template>
  <div class="pf-v5-m-display-lg pf-v5-u-min-width">
    <div class="pf-v5-c-menu pf-v5-m-plain pf-v5-m-scrollable">
      <ul class="pf-v5-c-menu__list">
        <li
          v-for="item in itemsTabs"
          :key="item.value"
          class="pf-v5-c-menu__item"
          :class="{
            'pf-v5-c-menu__list-item--selected': item.active,
          }"
          @mouseover="onSelectTab(item.value)"
        >
          <div class="pf-v5-c-menu__item-main">
            <span class="pf-v5-c-menu__item-text">{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import usei18n from '@/hooks/useI18n'
import { TimeTypeEnum } from '@/hooks/usePeriod'

const { t } = usei18n()

const emit = defineEmits<{
    (e: 'on-select-tab', payload: TimeTypeEnum): void;
}>();

interface Props {
    activeTab: string,
    showEach?: boolean,
}

const props = defineProps<Props>();

const tabsMap = Object.values(TimeTypeEnum)

const itemsTabs = computed(() => {
    const items = props.showEach ? tabsMap : tabsMap.filter(item => item !== 'each')

    return items.map(item => {
        return {
            value: item,
            name: t(`common.calendar.${ item}`),
            active: props.activeTab === item,
        }
    });
});

const onSelectTab = (value: TimeTypeEnum) => {
    emit('on-select-tab', value);
}
</script>

<style lang="scss">
</style>
