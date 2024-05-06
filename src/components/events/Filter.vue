<template>
  <div class="filter pf-l-flex pf-m-nowrap" :class="orientationClass">
    <div v-if="!hidePrefix" class="pf-c-action-list__item pf-u-mb-0 pf-u-mt-xs">
      <slot name="prefix">
        <UiIcon icon="fas fa-filter" />
      </slot>
    </div>
    <div
      class="filter__items pf-c-action-list"
      :class="{
        filter__items_hover: isAnyButtonHovered,
      }"
    >
      <CommonIdentifier v-if="showIdentifier" :index="index" />
      <div class="pf-c-action-list__item">
        <PropertySelect
          v-if="filter.propRef"
          :event-ref="eventRef"
          :event-refs="eventRefs"
          :selected="filter.propRef"
          :popper-container="props.popperContainer"
          @select="changeProperty"
        >
          <UiButton
            :class="{
              'pf-m-control pf-m-small': props.forPreview,
              'pf-m-secondary': !props.forPreview,
            }"
            :disabled="props.forPreview"
          >
            {{ propertyButtonText }}
          </UiButton>
        </PropertySelect>
        <PropertySelect
          v-else
          :is-open-mount="filter.propRef ? false : true"
          :event-ref="eventRef"
          :update-open="updateOpen"
          :popper-container="props.popperContainer"
          @select="changeProperty"
        >
          <UiButton
            :before-icon="'fas fa-plus-circle'"
            class="pf-m-primary"
            type="button"
            @click="handleSelectProperty"
          >
            {{ $t('events.selectProperty') }}
          </UiButton>
        </PropertySelect>
      </div>
      <div v-if="isShowOperation && filter.propRef" class="pf-c-action-list__item">
        <OperationSelect
          :property-ref="filter.propRef"
          :selected="filter.opId"
          :popper-container="props.popperContainer"
          @select="changeOperation"
        >
          <UiButton
            :class="[props.forPreview ? 'pf-m-control pf-m-small' : 'pf-m-secondary']"
            :disabled="props.forPreview"
          >
            {{ operationButtonText }}
          </UiButton>
        </OperationSelect>
      </div>
      <div v-if="isShowValues && filter.propRef" class="pf-c-action-list__item">
        <div v-if="isShowInputForValue">
          <UiInput
v-model="valueInput"
class="pf-u-px-lg pf-u-py-md"
@blur="onBlurInput"
/>
        </div>
        <ValueSelect
          v-else
          :property-ref="filter.propRef"
          :selected="filter.values"
          :items="filterItemValues"
          :popper-container="props.popperContainer"
          @add="addValue"
          @deselect="removeValue"
        >
          <template v-if="filter.values.length > 0">
            <div class="pf-c-action-list">
              <div
v-for="(item, i) in filterValuesList"
:key="i"
class="pf-c-action-list__item"
>
                <UiButton
                  :class="[props.forPreview ? 'pf-m-control pf-m-small' : 'pf-m-secondary']"
                  :disabled="props.forPreview"
                  @click="ocClickValue"
                >
                  {{ item.name }}
                  <span v-if="!props.forPreview" class="pf-c-button__icon pf-m-end">
                    <UiIcon icon="fas fa-times" @click.stop="removeValueButton(item.value)" />
                  </span>
                </UiButton>
              </div>
              <div class="pf-c-action-list__item filter__control-item">
                <UiButton
                  ref="elButtonValues"
                  class="pf-m-plain"
                  icon="fas fa-times"
                  @click="removeFilter"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <UiButton
:before-icon="'fas fa-plus-circle'"
class="pf-m-link"
@click="ocClickValue"
>
              {{ $t('events.select_value') }}
            </UiButton>
          </template>
        </ValueSelect>
      </div>
      <div v-if="filter.values.length === 0" class="pf-c-action-list__item filter__control-item">
        <UiButton
ref="elButtonMain"
class="pf-m-plain"
icon="fas fa-times"
@click="removeFilter"
/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDateFormat, useElementHover } from '@vueuse/core'
import { EventFilter } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'
import UiInput from '@/components/uikit/UiInput.vue'
import PropertySelect from '@/components/events/PropertySelect.vue'
import OperationSelect from '@/components/events/OperationSelect.vue'
import ValueSelect from '@/components/events/ValueSelect.vue'
import { EventRef, PropertyRef, UserCustomProperty } from '@/types/events'
import { operationById, OperationId, Value } from '@/types'
import CommonIdentifier from '@/components/common/identifier/CommonIdentifier.vue'
import { CustomProperty, DataType, Property, PropertyType } from '@/api'
import { OrientationEnum, OrientationTypeEnum } from '@/types/filters'

const NotAllowedOperationIds = {
  Exists: 'exists',
  Empty: 'empty',
  True: 'true',
  False: 'false',
} as const

type Props = {
  eventRef?: EventRef
  eventRefs?: EventRef[]
  filter: EventFilter
  index: number
  updateOpen?: boolean
  showIdentifier?: boolean
  popperContainer?: string
  forPreview?: boolean
  hidePrefix?: boolean
  orientation?: OrientationEnum
}

const lexiconStore = useLexiconStore()

const props = withDefaults(defineProps<Props>(), {
  orientation: OrientationTypeEnum.VERTICAL,
})

const elButtonMain = ref(null)
const elButtonValues = ref(null)
const isHoveredButtonMain = useElementHover(elButtonMain)
const isHoveredButtonValues = useElementHover(elButtonValues)

const isAnyButtonHovered = computed(() => {
  return isHoveredButtonMain.value || isHoveredButtonValues.value
})

const emit = defineEmits<{
  (e: 'changeFilterProperty', filterIdx: number, propRef: PropertyRef): void
  (e: 'removeFilter', index: number): void
  (e: 'changeFilterOperation', filterIdx: number, opId: OperationId): void
  (e: 'addFilterValue', filterIdx: number, value: Value): void
  (e: 'removeFilterValue', filterIdx: number, value: Value): void
  (e: 'handleSelectProperty'): void
  (e: 'changeAllValues', filterIdx: number, values: Value[]): void
  (e: 'on-click-value', filterIdx: number): void
}>()

const valueInput = ref('')

const onBlurInput = () => {
  addValue(valueInput.value)
}

const isShowOperation = computed(() => {
  return !(props.forPreview && !props.filter.values.length)
})

const isShowValues = computed(() => {
  return (
    !(
      NotAllowedOperationIds.Empty === props.filter.opId ||
      NotAllowedOperationIds.Exists === props.filter.opId ||
      NotAllowedOperationIds.False === props.filter.opId ||
      NotAllowedOperationIds.True === props.filter.opId
    ) && isShowOperation.value
  )
})

const filterPropRefType = computed((): PropertyType | null => {
  return props?.filter?.propRef?.type || null
})

const filterPropRefId = computed((): number | null => {
  return props?.filter?.propRef?.id || null
})

const filterProperty = computed((): Property | CustomProperty | UserCustomProperty | undefined => {
  if (filterPropRefType.value && filterPropRefId.value && props?.filter?.propRef) {
    return lexiconStore.property(props?.filter?.propRef)
  }
  return undefined
})

const selectedOperation = computed(() => {
  return props.filter.opId ? operationById?.get(props.filter.opId) || null : null
})

const orientationClass = computed(() => `filter_${props.orientation}`)

const operationButtonText = computed(() => {
  return props.filter.opId
    ? selectedOperation.value?.shortName || selectedOperation.value?.name
    : ''
})

const isShowInputForValue = computed(() => {
  return (selectedOperation.value?.dataTypes || []).includes(DataType.String)
})

const propertyButtonText = computed(() => {
  return props.filter?.propRef?.name || filterProperty.value?.name || props.filter?.propRef?.id
})

const isPropertyTypeTimestamp = computed(() => {
  return (filterProperty.value as Property)?.dataType === DataType.Timestamp
})

const filterValuesList = computed(() => {
  return props.filter.values.map(item => {
    return {
      value: item,
      name: isPropertyTypeTimestamp.value
        ? useDateFormat(+item, 'YYYY-MM-DD HH:mm')?.value
        : String(item),
    }
  })
})

const filterItemValues = computed(() => {
  return props.filter.valuesList.map((item: any) => {
    return {
      item,
      name: isPropertyTypeTimestamp.value
        ? useDateFormat(+item, 'YYYY-MM-DD HH:mm')?.value
        : String(item),
    }
  })
})

const removeFilter = (): void => {
  emit('removeFilter', props.index)
}

const changeProperty = (propRef: PropertyRef): void => {
  emit('changeFilterProperty', props.index, propRef)
}

const handleSelectProperty = (): void => {
  emit('handleSelectProperty')
}

const changeOperation = (opId: OperationId): void => {
  emit('changeFilterOperation', props.index, opId)
}

const ocClickValue = () => {
  emit('on-click-value', props.index)
}

const addValue = (value: Value): void => {
  if (value === null) {
    changeOperation(OperationId.Empty)
    emit('changeAllValues', props.index, [])
    return
  }

  if (value === false) {
    changeOperation(OperationId.False)
    emit('changeAllValues', props.index, [])
    return
  }

  if (value === true) {
    changeOperation(OperationId.True)
    emit('changeAllValues', props.index, [])
    return
  }

  emit('addFilterValue', props.index, value)
}

const removeValue = (value: Value) => {
  emit('removeFilterValue', props.index, value)
}

const removeValueButton = (value: Value) => {
  emit('removeFilterValue', props.index, value)
}
</script>

<style lang="scss">
.filter {
  .pf-c-action-list {
    flex-wrap: wrap;
    gap: 0.5rem;

    & > * + * {
      margin-left: 0;
    }
  }

  &:hover {
    .filter__control-item {
      opacity: 1;
    }
  }
  &__control-item {
    opacity: 0;
  }
  &__items {
    &_hover {
      .pf-c-button {
        --pf-c-button--after--BorderWidth: var(--pf-c-button--hover--after--BorderWidth);
        text-decoration: none;
        &.pf-m-secondary {
          --pf-c-button--m-secondary--Color: var(--pf-c-button--m-secondary--hover--Color);
          --pf-c-button--m-secondary--BackgroundColor: #fff;
          --pf-c-button--after--BorderColor: var(
            --pf-c-button--m-secondary--hover--after--BorderColor
          );
        }
      }
    }
  }
  &_horizontal {
    .pf-c-action-list {
      &__item {
        margin-bottom: 0;
        margin-left: 1rem;
      }
    }
    > .pf-c-action-list {
      padding-right: 0;
    }
  }

  > .pf-c-action-list {
    position: relative;
  }
  .pf-c-action-list {
    position: relative;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}
</style>
