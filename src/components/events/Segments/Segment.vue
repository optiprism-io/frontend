<template>
  <div
    class="segment pf-l-flex pf-m-column"
    :class="{
      'segment_active': dropdownStatesControl,
    }"
  >
    <div
      v-if="!props.isOneSegment"
      class="pf-l-flex"
    >
      <CommonIdentifier
        class="pf-l-flex__item"
        :index="props.index"
      />
      <div class="pf-c-action-list">
        <div class="pf-c-action-list__item">
          <UiEditableText
            :value="name"
            @on-save="onRename"
          >
            <span>{{ name }}</span>
          </UiEditableText>
        </div>
        <Select
          class="pf-c-action-list__item"
          :items="conditionItems"
          :is-open-mount="false"
          @select="addCondition"
          @show="show"
          @hide="hide"
        >
          <div
            class="segment__control"
          >
            <VTooltip popper-class="ui-hint">
              <UiIcon icon="fas fa-filter" />
              <template #popper>
                {{ $t('events.segments.addCondition') }}
              </template>
            </VTooltip>
          </div>
        </Select>
        <div
          class="pf-c-action-list__item segment__control"
          @click="onRemove"
        >
          <VTooltip popper-class="ui-hint">
            <UiIcon icon="fas fa-times" />
            <template #popper>
              {{ $t('events.segments.remove') }}
            </template>
          </VTooltip>
        </div>
      </div>
    </div>
    <div
      class="segment__condition-list"
      :class="{
        'pf-u-pl-xl': !props.isOneSegment,
      }"
    >
      <Condition
        v-for="(condition, i) in props.conditions"
        :key="i"
        :index="i"
        :condition="condition"
        :next-condition="props.conditions[i + 1] || null"
        :update-open="updateOpenCondition"
        :index-parent="props.index"
        :auto-hide-event="props.autoHideEvent"
        :is-one="props.isOneSegment"
        :allow-and-or="props.isOneSegment && i > 0 ? !['and', 'or'].includes(props.conditions[i - 1]?.action?.id || '') : false"
        :show-remove="props.isOneSegment ? conditionsLength > 1 && (conditionsLength !== i + 1) && (showRemoveCondition.length > 1 ? true : !!condition?.action) : true"
        @on-click-value="onClickValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { Tooltip as VTooltip } from 'floating-vue'

import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue';
import Condition from '@/components/events/Segments/Condition.vue';
import Select from '@/components/Select/Select.vue';
import UiEditableText from '@/components/uikit/UiEditableText.vue';
import UiIcon from '@/components/uikit/UiIcon.vue'

import { conditions as conditionsMap } from '@/configs/events/segmentCondition';
import usei18n from '@/hooks/useI18n';

import type { Condition as ConditionType } from '@/types/events';

type Item = {
    id: string,
    name: string,
}

interface Props {
    index: number
    name: string
    conditions: ConditionType[]
    autoHideEvent?: boolean
    isOneSegment?: boolean
    isLast?: boolean
    isActiveAndOrFilter?: boolean
    segmentsLength: number
}

interface ItemConditionType {
    item: Item,
    items?: ItemConditionType[],
    name: string,
    description: string,
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'on-remove', inx: number): void
    (e: 'on-rename', name: string, idx: number): void
    (e: 'add-condition', idx: number, ref: { id: string, name: string }): void
    (e: 'on-click-value', idx: number, indexParent: number): void;
}>()

const { t, keyExists } = usei18n();
const updateOpenCondition = ref(false)
const dropdownStatesControl = ref(false);

const showRemoveCondition = computed(() => {
    return props.conditions.filter(item => !item?.action?.id);
});

const onClickValue = (index: number, indexParent: number) => {
    emit('on-click-value', index, indexParent);
};

const getConditionItem = (key: string): ItemConditionType => {
    const name = t(`events.condition.${key}`) as string;
    const hintKey = `events.condition.${key}_hint`;

    return {
        item: {
            id: key,
            name,
        },
        name,
        description: keyExists(hintKey) ? t(hintKey) : '',
    };
};

const conditionItems = computed(() => {
    return conditionsMap.map(item => getConditionItem(item.key));
});

const conditionsLength = computed(() => {
    return props.conditions.length;
});

const onRename = (name: string): void => emit('on-rename', name, props.index)

const addCondition = (payload: { id: string, name: string }): void => {
    emit('add-condition', props.index, payload);
}

const show = () => {
    dropdownStatesControl.value = true;
};

const hide = () => {
    dropdownStatesControl.value = false;
};

const onRemove = (): void => emit('on-remove', props.index)
</script>

<style lang="scss">
.segment {
    &__control {
        padding: 5px;
        opacity: 0;
        cursor: pointer;
        color: var(--op-base-color-text);

        &:hover {
            color: var(--pf-global--palette--black-800);
        }
    }
    &_active,
    &:hover {
        .segment {
            &__control {
                opacity: 1;
            }
        }
    }
}
</style>
