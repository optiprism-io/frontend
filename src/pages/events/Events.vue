<template>
  <section>
    <UiTabs
      class="pf-u-mb-md"
      :items="items"
      @on-select="onSelectPage"
    />
    <router-view />
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
      :user-properties="userProperties"
      :loading="eventManagementPopupLoading"
      @apply="eventManagementPopupApply"
      @cancel="eventManagementPopupCancel"
      @on-action-property="onActionProperty"
      @on-action-user-property="onActiononUserProperty"
    />
    <UserPropertyPopup
      v-if="lexiconStore.userPropertyPopup"
      :property="editProperty"
      @apply="userPropertyPopupApply"
      @cancel="userPropertyPopupCancel"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLexiconStore } from '@/stores/lexicon'
import { useLiveStreamStore } from '@/stores/reports/liveStream'
import { useCommonStore, PropertyTypeEnum } from '@/stores/common'
import EventPropertyPopup, { ApplyPayload } from '@/components/events/EventPropertyPopup.vue'
import EventManagementPopup, {
  ApplyPayload as ApplyPayloadEvent,
} from '@/components/events/EventManagementPopup.vue'
import UserPropertyPopup, {
  ApplyPayload as ApplyPayloadUser,
} from '@/components/events/UserPropertyPopup.vue'
import { Action } from '@/components/uikit/UiTable/UiTable'
import navPagesConfig from '@/configs/events/navPages.json'
import { pagesMap } from '@/router'
import { Property } from '@/api'
const i18n = inject<any>('i18n')
const route = useRoute()
const lexiconStore = useLexiconStore()
const liveStreamStore = useLiveStreamStore()
const commonStore = useCommonStore()

const propertyPopupLoading = ref(false)
const eventManagementPopupLoading = ref(false)
const editProperty = ref<Property | null>(null)
const popupLoading = ref(false)

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
  if (commonStore.editEventPropertyPopupId) {
    if (commonStore.editEventPropertyPopupType === PropertyTypeEnum.EventProperty) {
      return lexiconStore.findEventPropertyById(commonStore.editEventPropertyPopupId)
    } else {
      return lexiconStore.findUserPropertyById(commonStore.editEventPropertyPopupId)
    }
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

const userPropertiesIds = computed(() => {
  return (editEventManagementPopup.value && editEventManagementPopup.value?.userProperties) || []
})
const userProperties = computed(() => {
  return userPropertiesIds.value.reduce((acc: Property[], id) => {
    const property = lexiconStore.findUserPropertyById(id)
    if (property) {
      acc.push(property)
    }
    return acc
  }, [])
})

const initEventsAndProperties = async () => {
  await Promise.all([
    lexiconStore.getEvents(),
    lexiconStore.getSystemProperties(),
    lexiconStore.getEventProperties(),
    lexiconStore.getUserProperties(),
  ])
}

onMounted(async () => {
  await initEventsAndProperties()

  if (route.name === pagesMap.eventsLiveStream.name) {
    liveStreamStore.getReportLiveStream()
  }
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

const onActiononUserProperty = (payload: ApplyPayloadEvent) => {
  if (typeof payload.type === 'number') {
    commonStore.toggleEventManagementPopup(false)
    const property = lexiconStore.findUserPropertyById(payload.type)

    if (property) {
      commonStore.editEventPropertyPopupId = Number(payload.type) || null
      editProperty.value = property
      lexiconStore.userPropertyPopup = true
    }
  }
}

const userPropertyPopupApply = async (payload: ApplyPayloadUser) => {
  popupLoading.value = false
  await lexiconStore.updateUserProperty(payload)
  popupLoading.value = false
  commonStore.editEventPropertyPopupId = null
  lexiconStore.userPropertyPopup = false
  editProperty.value = null
}

const userPropertyPopupCancel = () => {
  lexiconStore.userPropertyPopup = false
}

const onSelectPage = (value: string) => {
  if (value === pagesMap.eventsLiveStream.name) {
    liveStreamStore.getReportLiveStream()
  }
}
</script>

<style lang="scss"></style>
