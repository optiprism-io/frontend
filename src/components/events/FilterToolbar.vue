<template>
  <div class="filter-toolbar">
    <div class="filter-toolbar__content">
      <div class="filter-toolbar__left">
        <div class="filter-toolbar__item pf-u-mr-md pf-u-mb-md">
          <UiSelect
            :items="itemsGroupBy"
            :text-button="selectedGroupByString"
            :selections="[eventsStore.controlsGroupBy]"
            @on-select="onSelectGroupBy"
          />
        </div>
        <div class="filter-toolbar__item pf-u-mr-md pf-u-mb-md">
          <UiToggleGroup
            :items="itemsPeriod"
            @select="onSelectPerion"
          >
            <template #after>
              <UiDatePicker
                :value="calendarValue"
                :last-count="lastCount"
                :active-tab-controls="eventsStore.period.type"
                @on-apply="onApplyPeriod"
              >
                <template #action>
                  <button
                    class="pf-c-toggle-group__button"
                    :class="{
                      'pf-m-selected': calendarValueString,
                    }"
                    type="button"
                  >
                    <span
                      class="pf-c-toggle-group__icon pf-c-toggle-group__text"
                    >
                      <UiIcon icon="far fa-calendar-alt" />
                    </span>
                    <span
                      v-if="calendarValueString"
                      class="pf-c-toggle-group__text"
                    >
                      {{ calendarValueString }}
                    </span>
                  </button>
                </template>
              </UiDatePicker>
            </template>
          </UiToggleGroup>
        </div>
        <slot name="content" />
      </div>
      <div
        v-if="$slots.right"
        class="filter-toolbar__right pf-u-ml-auto"
      >
        <div class="filter-toolbar__item">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import UiDatePicker from '@/components/uikit/UiDatePicker.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import UiToggleGroup from '@/components/uikit/UiToggleGroup/UiToggleGroup.vue'

import { groupByMap, periodMap } from '@/configs/events/controls'
import { getStringDateByFormat } from '@/helpers/getStringDates'
import { useEventsStore } from '@/stores/eventSegmentation/events'

import type { TimeUnit } from '@/api'
import type { ApplyPayload } from '@/components/uikit/UiCalendar/UiCalendar'
import type { UiToggleGroupItem } from '@/components/uikit/UiToggleGroup/types'

const emit = defineEmits<{
    (e: 'on-change'): void
}>()

const eventsStore = useEventsStore()
const { t } = useI18n()

const itemsGroupBy = computed(() => {
    return groupByMap.map((key) => ({
        key,
        nameDisplay: key,
        value: key,
    }))
});

const selectedGroupByString = computed(() => {
    const selectedGroupBy = itemsGroupBy.value.find(item => item.value === eventsStore.controlsGroupBy);

    return selectedGroupBy ? `${t('common.groupBy')} ${selectedGroupBy.nameDisplay}` : '';
});

const itemsPeriod = computed(() => {
    const activeKey: string = eventsStore.controlsGroupBy;
    const config = periodMap.find(item => item.type === activeKey);

  if (config) {
    return config.items.map(
      (key, i): UiToggleGroupItem<string> => ({
        key,
        nameDisplay: key + config.text,
        value: key,
        selected: eventsStore.controlsGroupBy ? key === eventsStore.controlsPeriod : i === 0,
      })
    )
  } else {
    return []
  }
})

const period = computed(() => {
    return eventsStore.period;
});

const lastCount = computed(() => {
    return period.value.last;
});

const calendarValue = computed(() => {
    return {
        from: period.value.from,
        to: period.value.to,
        multiple: false,
        dates: [],
    };
});

const calendarValueString = computed(() => {
    if (eventsStore.period.from && eventsStore.period.to && eventsStore.controlsPeriod === 'calendar') {
        switch(eventsStore.period.type) {
            case 'last':
                return `${t('common.calendar.last')} ${eventsStore.period.last} ${eventsStore.period.last === 1 ? 'day' : 'days'}`;
            case 'since':
                return `${t('common.calendar.since')} ${getStringDateByFormat(eventsStore.period.from, '%d %b, %Y')}`;
            case 'between':
                return `${getStringDateByFormat(eventsStore.period.from, '%d %b, %Y')} - ${getStringDateByFormat(eventsStore.period.to, '%d %b, %Y')}`;
            default:
                return '';
        }
    } else {
        return '';
    }
});

const onChange = () => {
    emit('on-change');
};

const onSelectGroupBy = (payload: string) => {
    eventsStore.initPeriod();
    eventsStore.controlsGroupBy = payload as TimeUnit;
    eventsStore.controlsPeriod = itemsPeriod.value[itemsPeriod.value.length - 1].value;

    onChange();
};

const onSelectPerion = (payload: string) => {
    eventsStore.controlsPeriod = payload;
    eventsStore.initPeriod();
    onChange();
};

const onApplyPeriod = (payload: ApplyPayload): void => {
    eventsStore.controlsPeriod = 'calendar';
    eventsStore.period = {
        ...eventsStore.period,
        from: payload.value.from || '',
        to: payload.value.to || '',
        type: payload.type,
        last: payload.last,
    };
    onChange();
};
</script>

<style lang="scss" scoped>
.filter-toolbar {
    &__left {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    &__item {
        white-space: nowrap;
    }
}
</style>
