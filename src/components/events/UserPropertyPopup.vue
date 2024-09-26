<template>
  <UiPopupWindow
    :title="title"
    :apply-loading="props.loading"
    class="event-management-popup"
    :apply-button="applyButton"
    :cancel-button="strings.close"
    :apply-disabled="applyDisabled"
    @apply="apply"
    @cancel="cancel"
  >
    <div class="event-management-popup__content">
      <UiDescriptionList
        v-if="activeTab === 'property'"
        :items="propertyItems"
        :horizontal="true"
        @on-input="onInputPropertyItem"
      />
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useI18n } from 'vue-i18n'

import type { Item, ActionPayload } from '@/components/uikit/UiDescriptionList.vue'
import UiDescriptionList from '@/components/uikit/UiDescriptionList.vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'

import {
  propertyValuesConfig,
  DisplayName,
  EventValuesConfigKeysEnum,
} from '@/configs/events/eventValues'
import { useCommonStore, PropertyTypeEnum } from '@/stores/common'

import type { Property } from '@/api'
import type { Action } from '@/components/uikit/UiTable/UiTable'
import type { Item as PropertyValueConfig } from '@/configs/events/eventValues'

export type EventObject = {
  [key: string]: string | string[] | boolean
}
export type ApplyPayload = EventObject

type Props = {
  name?: string
  loading?: boolean
  property: Property | null
  showApply: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'apply', payload: ApplyPayload): void
  (e: 'on-action-event', payload: Action): void
}>()

const strings = computed(() => {
  return {
    property: t('events.event_management.popup.tabs.property'),
    columnsName: t('events.event_management.columns.name'),
    save: t('common.save'),
    close: t('common.close'),
  }
})

const commonStore = useCommonStore();

const { t } = useI18n()

const activeTab = ref('property')

const editProperty = ref<EventObject | null>(null)
const applyDisabled = computed(() => !editProperty.value)
const applyButton = computed(() => (props.showApply ? strings.value.save : ''))

const title = computed(() =>
  props.property ? `${strings.value.property}: ${props.property.name}` : ''
)

const propertyItems = computed<Item[]>(() => {
  const items: Item[] = []
  const property = props.property
  if (property) {
    const keys = Object.keys(propertyValuesConfig) as (keyof typeof props.property)[]

    keys.forEach(key => {
      const config: PropertyValueConfig = propertyValuesConfig[key]
      let value =
        editProperty.value && key in editProperty.value
          ? editProperty.value[key]
          : property[key] || property[key]
      let label: string = t(config.string)
      let name: string = key

      if (
        commonStore.editEventPropertyPopupType === PropertyTypeEnum.UserProperty &&
        key === DisplayName
      ) {
        value = property.name
        label = strings.value.columnsName
        name = 'name'
      }

      if (key === 'status') {
        value = property[key] === 'enabled'
      }

      if (key === EventValuesConfigKeysEnum.Tags) {
        value = property?.tags || []
      }

      if (key === 'type') {
        value = property.isArray
          ? t('common.list_of', { type: t(`common.types.${property.dataType}`) })
          : t(`common.types.${property.dataType}`)
      }

      const item: Item = {
        label,
        key: name,
        value,
        component: config.component || 'p',
      }

      items.push(item)
    })
  }

  return items
})

const apply = () => {
  if (editProperty.value) {
    emit('apply', editProperty.value)
  }
}

const cancel = () => {
  emit('cancel')
}

const onInputPropertyItem = async (payload: ActionPayload) => {
  let value = payload.value

  if (payload.key === 'status') {
    value = payload.value ? 'enabled' : 'disabled'
  }

  if (editProperty.value) {
    editProperty.value[payload.key] = value
  } else {
    editProperty.value = {
      [payload.key]: value,
    }
  }
}
</script>
