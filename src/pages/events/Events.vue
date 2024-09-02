<template>
  <section>
    <UiTabs
      class="pf-u-mb-md"
      :items="items"
      @on-select="onSelectPage"
    />
    <RouterView />
    <EventPropertyPopup
      v-if="commonStore.showEventPropertyPopup && editPropertyPopup"
      :loading="propertyPopupLoading"
      :property="editPropertyPopup"
      :events="editPropertyEventsPopup"
      @apply="propertyPopupApply"
      @cancel="propertyPopupCancel"
      @on-action-event="onActionEvent"
    />
    <EventManagementPopup
      v-if="commonStore.showEventManagementPopup"
      :event="editEventManagementPopup"
      :properties="eventProperties"
      :loading="eventManagementPopupLoading"
      @apply="eventManagementPopupApply"
      @cancel="eventManagementPopupCancel"
      @on-action-property="onActionProperty"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'

import type {
  ApplyPayload as ApplyPayloadEvent,
} from '@/components/events/EventManagementPopup.vue'
import EventManagementPopup from '@/components/events/EventManagementPopup.vue'
import type { ApplyPayload } from '@/components/events/EventPropertyPopup.vue'
import EventPropertyPopup from '@/components/events/EventPropertyPopup.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'

import navPagesConfig from '@/configs/events/navPages.json'
import { pagesMap } from '@/router'
import { useCommonStore, PropertyTypeEnum } from '@/stores/common'
import { useLexiconStore } from '@/stores/lexicon'
import { useLiveStreamStore } from '@/stores/reports/liveStream'

import type { Property } from '@/api'
import type { Action } from '@/components/uikit/UiTable/UiTable'

const i18n = inject<any>('i18n')
const route = useRoute()
const lexiconStore = useLexiconStore()
const liveStreamStore = useLiveStreamStore()
const commonStore = useCommonStore()

const propertyPopupLoading = ref(false)
const eventManagementPopupLoading = ref(false)

const items = computed(() => {
  return navPagesConfig.map(item => {
    return {
      ...item,
      name: i18n.$t(item.name),
      active: route.name === item.value,
    }
  })
})

const editPropertyPopup = computed(() => {
  if (commonStore.editEventPropertyPopupId && commonStore.editEventPropertyPopupType === PropertyTypeEnum.EventProperty) {
    return lexiconStore.findEventPropertyById(commonStore.editEventPropertyPopupId)
  } else {
    return null
  }
})

const editPropertyEventsPopup = computed(() => {
  if (commonStore.editEventPropertyPopupId) {
    const property = lexiconStore.findEventPropertyById(commonStore.editEventPropertyPopupId)
    if (property?.events?.length) {
      return property.events.map(id => {
        return lexiconStore.findEventById(id)
      })
    } else {
      return []
    }
  } else {
    return []
  }
})

const eventManagementPopupCancel = () => {
  commonStore.toggleEventManagementPopup(false)
}

const eventManagementPopupApply = async (payload: ApplyPayloadEvent) => {
  eventManagementPopupLoading.value = true
  await lexiconStore.updateEvent(payload)
  eventManagementPopupLoading.value = false
  commonStore.toggleEventManagementPopup(false)
}

const editEventManagementPopup = computed(() => {
  if (commonStore.editEventManagementPopupId) {
    return lexiconStore.findEventById(commonStore.editEventManagementPopupId)
  } else {
    return null
  }
})

const eventPropertiesIds = computed(() => {
  return (editEventManagementPopup.value && editEventManagementPopup.value?.eventProperties) || []
})
const eventProperties = computed(() => {
  return eventPropertiesIds.value.reduce((acc: Property[], id) => {
    const property = lexiconStore.findEventPropertyById(id)
    if (property) {
      acc.push(property)
    }
    return acc
  }, [])
})

const propertyPopupApply = async (payload: ApplyPayload) => {
  propertyPopupLoading.value = true
  await lexiconStore.updateProperty(payload)
  propertyPopupLoading.value = false
  commonStore.showEventPropertyPopup = false

  if (route.name === pagesMap.eventsLiveStream.name) {
    liveStreamStore.getReportLiveStream()
  }
}

const propertyPopupCancel = () => {
  commonStore.showEventPropertyPopup = false
}

const onActionEvent = (payload: Action) => {
  commonStore.updateEditEventManagementPopupId(Number(payload.type) || null)
  commonStore.showEventPropertyPopup = false
  commonStore.showEventManagementPopup = true
}

const onActionProperty = (payload: Action) => {
  commonStore.editEventPropertyPopupId = Number(payload.type) || null
  commonStore.showEventManagementPopup = false
  commonStore.showEventPropertyPopup = true
}

const onSelectPage = (value: string) => {
  if (value === pagesMap.eventsLiveStream.name) {
    liveStreamStore.getReportLiveStream()
  }
}
</script>
