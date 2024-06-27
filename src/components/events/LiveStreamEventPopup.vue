<template>
  <UiPopupWindow
    :title="title"
    class="live-stream-event-popup"
    @cancel="cancel"
  >
    <UiTabs
      class="pf-u-mb-md"
      :items="tabs"
      @on-select="selectTab"
    />
    <div class="live-stream-event-popup__content">
      <UiSpinner v-if="loading" />
      <UiTable
        v-else
        class="live-stream-event-popup__table"
        :compact="true"
        :items="items"
        :columns="columns"
        :show-toolbar="false"
        :no-data-text="strings.eventNoProperties"
        :is-loading="loading"
      />
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'

import { useDateFormat } from '@vueuse/core'

import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'

import { PropertyType } from '@/api'
import { apiClient } from '@/api/apiClient'
import usei18n from '@/hooks/useI18n'
import { useProjectsStore } from '@/stores/projects/projects'

import type { EventRecord, PropertyAndValue, Group } from '@/api'
import type { Row } from '@/components/uikit/UiTable/UiTable'

const projectsStore = useProjectsStore()
const { t } = usei18n()

const props = defineProps<{
  id: number
  name: string
  groupsMap: { [key: number]: Group }
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'apply'): void
}>()

const strings = {
  eventNoProperties: t('common.eventNoProperties'),
}

type PropertiesMapKey = PropertyType | number

const activeTab = ref<PropertiesMapKey>()
const loading = ref(true)
const event = ref<EventRecord | null>(null)

const properties = computed(() => event.value?.properties || [])

type PropertiesMap = {
  [key in PropertiesMapKey]?: Array<PropertyAndValue>
}
const propertiesMap = computed<PropertiesMap>(() => {
  const items: PropertiesMap = {}

  properties.value.forEach(item => {
    let key: PropertiesMapKey = item.propertyType

    if (item.propertyType === PropertyType.Group && (item.group || item.group === 0)) {
      key = item.group
    }

    if (items[key]) {
      items[key]?.push(item)
    } else {
      items[key] = [item]
    }
  })

  return items
})

const propertiesTypes = computed(() =>
  Object.keys(propertiesMap.value).sort((a, b) => {
    return a === 'event' ? -1 : 1
  })
)

const title = computed(() => {
  return t('events.liveStream.popup.title', {
    name: props.name,
  })
})

const items = computed<Row[]>(() => {
  const properties = activeTab.value ? propertiesMap.value[activeTab.value] || [] : []
  return properties
    ? properties.map((item): Row => {
        return [
          {
            key: 'name',
            title: item.propertyName || '',
          },
          {
            key: 'value',
            title:
              item.propertyName === 'created_at'
                ? useDateFormat(+item.value, 'YYYY-MM-DD HH:mm').value
                : item.value,
          },
        ]
      })
    : []
})

const columns = computed(() => {
  return ['name', 'value'].map(key => {
    return {
      value: key,
      title: t(`events.event_management.columns.${key}`),
    }
  })
})

const tabs = computed(() => {
  return propertiesTypes.value.map(key => {
    return {
      name: props.groupsMap[+key]
        ? props.groupsMap[+key]?.name || ''
        : t(`events.liveStream.popup.tabs.${key}`),
      active: activeTab.value === key,
      value: key,
    }
  })
})

const cancel = () => {
  emit('cancel')
}

const selectTab = (value: string) => {
  activeTab.value = value as PropertiesMapKey
}

const getEvent = async () => {
  loading.value = true
  const res = await apiClient.eventRecords.getEventRecord(projectsStore.projectId, props.id)

  if (res.data) {
    event.value = res.data
  }
  activeTab.value = propertiesTypes.value[0] as PropertiesMapKey

  loading.value = false
}

onMounted(async () => {
  if (props.id) {
    await getEvent()
  }
})
</script>

<style lang="scss">
.live-stream-event-popup {
  .pf-c-modal-box__body {
    min-height: 316px;
  }
  &__table {
    th {
      width: 50%;
    }
  }
}
</style>
