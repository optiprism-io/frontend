<template>
  <div class="pf-l-flex pf-m-column">
    <SelectedEvent
      v-for="(event, index) in events"
      :key="index"
      :event="event"
      :event-ref="event.ref"
      :filters="event.filters"
      :index="index"
      :event-items="lexiconStore.eventsList"
      :show-breakdowns="false"
      :show-query="false"
      :auto-hide="!commonStore.showCreateCustomEvent"
      @set-event="setEvent"
      @edit="editEvent"
      @action="selectAction"
      @remove-event="removeEvent"
      @on-change="onChange"
    />
  </div>
  <Select
    grouped
    :items="lexiconStore.eventsList"
    :auto-hide="!commonStore.showCreateCustomEvent"
    @select="addEvent"
    @action="selectAction"
    @edit="editEvent"
  >
    <UiButton
      :is-link="true"
      :before-icon="'fas fa-plus'"
    >
      {{ $t('common.addEvent') }}
    </UiButton>
  </Select>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { EventRef } from '@/types/events'
import { EventPayload } from '@/stores/eventSegmentation/events'

import { useLexiconStore } from '@/stores/lexicon'
import { useLiveStreamStore } from '@/stores/reports/liveStream'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'

import Select from '@/components/Select/Select.vue'
import SelectedEvent from '@/components/events/Events/SelectedEvent.vue'

const lexiconStore = useLexiconStore()
const liveStreamStore = useLiveStreamStore()
const commonStore = useCommonStore()
const eventsStore = useEventsStore()

const events = computed(() => liveStreamStore.events)

const addEvent = (ref: EventRef) => {
    liveStreamStore.events.push({
        ref: {
            type: ref.type,
            id: ref.id,
            name: ref.name,
        },
        filters: [],
        breakdowns: [],
        queries: [],
    })

    updateReport()
}

const updateReport = () => {
    liveStreamStore.getReportLiveStream()
}

const setEvent = (payload: EventPayload) => {
    liveStreamStore.events[payload.index] = payload.event
    updateReport()
}

const removeEvent = (idx: number): void => {
    liveStreamStore.events.splice(idx, 1)
    updateReport()
}

const selectAction = (payload: string) => {
    if (payload === 'createCustomEvent') {
        eventsStore.setEditCustomEvent(null)
        commonStore.togglePopupCreateCustomEvent(true)
    }
}

const editEvent = (payload: number) => {
    eventsStore.setEditCustomEvent(Number(payload))
    commonStore.togglePopupCreateCustomEvent(true)
}

const onChange = () => {
    updateReport()
}
</script>

<style scoped lang="scss">
</style>
