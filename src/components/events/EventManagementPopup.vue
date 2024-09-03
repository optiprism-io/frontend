<template>
  <UiPopupWindow
    :title="title"
    :apply-loading="props.loading"
    class="event-management-popup"
    :apply-button="$t('common.save')"
    :cancel-button="$t('common.close')"
    :apply-disabled="applyDisabled"
    @apply="apply"
    @cancel="cancel"
  >
    <UiTabs
      class="pf-u-mb-md"
      :items="itemsTabs"
      @on-select="onSelectTab"
    />
    <div class="event-management-popup__content">
      <UiDescriptionList
        v-if="activeTab === 'event'"
        :items="eventItems"
        :horizontal="true"
        @on-input="onInputEventItem"
      />
      <UiTable
        v-if="activeTab === 'properties'"
        :compact="true"
        :items="itemsProperties"
        :columns="columnsProperties"
        :show-toolbar="false"
        :enable-placeholder="false"
        @on-action="onActionProperty"
      />
      <!-- <UiTable
        v-if="activeTab === 'userProperties'"
        :compact="true"
        :items="itemsUserProperties"
        :columns="columnsProperties"
        :show-toolbar="false"
        :enable-placeholder="false"
        @on-action="onActionUserProperty"
      /> -->
      <DataEmptyPlaceholder v-if="noData" :content="noDataText" />
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useI18n } from 'vue-i18n'

import DataEmptyPlaceholder from '@/components/common/data/DataEmptyPlaceholder.vue'
import type { Item, ActionPayload } from '@/components/uikit/UiDescriptionList.vue';
import UiDescriptionList from '@/components/uikit/UiDescriptionList.vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'

import {
  eventValuesConfig,
  EventValuesConfigKeysEnum,
} from '@/configs/events/eventValues'
import propertiesColumnsConfig from '@/configs/events/propertiesTable.json'

import type { Property, Event } from '@/api'
import type { Action, Row } from '@/components/uikit/UiTable/UiTable'
import type {
  Item as EventValuesConfig} from '@/configs/events/eventValues';
import type { EventCustomProperty } from '@/types/events'

export type EventObject = {
  [key: string]: string | string[] | boolean
}
export type ApplyPayload = EventObject

type Props = {
  name?: string
  loading?: boolean
  event: Event | null
  properties: Property[]
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'apply', payload: ApplyPayload): void
  (e: 'on-action-property', payload: Action): void
  // (e: 'on-action-user-property', payload: ApplyPayload): void
}>()

const i18n = useI18n()

const tabs = {
  event: 'event',
  properties: 'properties',
}

const activeTab = ref('event')

const editEvent = ref<EventObject | null>(null)
const applyDisabled = computed(() => !editEvent.value)

const noDataText = computed(() => {
  if (activeTab.value === tabs.properties) {
    return itemsProperties.value?.length ? '' : i18n.t('common.eventNoProperties')
  }
  return ''
})

const noData = computed(() => {
  return !props.loading && noDataText.value
})

const getTableRows = (properties: Property[] | EventCustomProperty[]) => {
  return properties.map((prop: Property | EventCustomProperty): Row => {
    const keys = propertiesColumnsConfig.map(item => item.key) as (keyof typeof prop)[]
    const rows: Row = []

    keys.forEach(key => {
      if (prop[key]) {
        rows.push(
          key === 'name'
            ? {
                key: 'name',
                title: String(prop[key]) || '',
                component: UiTablePressedCell,
                action: {
                  type: prop.id,
                  name: prop.name,
                },
              }
            : {
                key,
                title: String(prop[key]) || '',
              }
        )
      }
    })

    return rows
  })
}

const getValueEventItems = (key: EventValuesConfigKeysEnum) => {
  if (props.event) {
    switch (key) {
      case EventValuesConfigKeysEnum.Status:
        return key in props.event ? props.event[key] === 'enabled' : ''
      case EventValuesConfigKeysEnum.Tags:
        return props.event[key] || []
      default:
        return editEvent.value && key in editEvent.value
          ? editEvent.value[key] || ''
          : key in props.event
            ? props.event[key] || ''
            : ''
    }
  } else {
    return ''
  }
}

const itemsTabs = computed(() => {
  return Object.values(tabs).map(key => {
    return {
      name: i18n.t(`events.event_management.popup.tabs.${key}`),
      active: activeTab.value === key,
      value: key,
    }
  })
})

const eventItems = computed<Item[]>(() => {
  const items: Item[] = []
  const event = props.event

  if (event) {
    const keys = Object.keys(eventValuesConfig) as (keyof typeof props.event)[]
    keys.forEach(key => {
      const config: EventValuesConfig = eventValuesConfig[key]
      if (key in event) {
        const item: Item = {
          label: i18n.t(config.string),
          key,
          value: getValueEventItems(key),
          component: config.component || 'p',
        }
        items.push(item)
      }
    })
  }
  return items
})

const title = computed(() =>
  props.event ? `${i18n.t('events.event_management.event')}: ${props.event.name}` : ''
)

const columnsProperties = computed(() => {
  return propertiesColumnsConfig.map(item => {
    return {
      value: item.key,
      title: i18n.t(item.string),
    }
  })
})

const itemsProperties = computed(() => getTableRows(props.properties))
// const itemsUserProperties = computed(() => getTableRows(props.userProperties))

const onSelectTab = (payload: string) => {
  activeTab.value = payload
}

const apply = () => {
  if (editEvent.value) {
    emit('apply', editEvent.value)
  }
}

const cancel = () => {
  emit('cancel')
}

const onInputEventItem = async (payload: ActionPayload) => {
  let value = payload.value

  if (payload.key === 'status') {
    value = payload.value ? 'enabled' : 'disabled'
  }

  if (editEvent.value) {
    editEvent.value[payload.key] = value
  } else {
    editEvent.value = {
      [payload.key]: value,
    }
  }
}

// const onActionUserProperty = (payload: Action) => {
//   emit('on-action-user-property', payload as ApplyPayload)
// }

const onActionProperty = (payload: Action) => {
  emit('on-action-property', payload)
}
</script>
