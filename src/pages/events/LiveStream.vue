<template>
  <ToolsLayout :col-lg="12">
    <template #title>
      {{ strings.title }}
    </template>
    <UiCard
      class="pf-v5-c-card pf-v5-m-compact pf-v5-u-h-100"
      :title="strings.events"
    >
      <InputsEventsLiveStream />
    </UiCard>
    <template #main>
      <UiCardContainer class="pf-v5-u-h-100">
        <TableLiveStream />
      </UiCardContainer>
    </template>
  </ToolsLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import InputsEventsLiveStream from '@/components/events/LiveStream/InputsEventsLiveStream.vue'
import TableLiveStream from '@/components/events/LiveStream/TableLiveStream.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { PropertyType } from '@/api'
import useI18n from '@/hooks/useI18n'
import { useLexiconStore } from '@/stores/lexicon'
import { useLiveStreamStore } from '@/stores/reports/liveStream'

import type { PropertyRef } from '@/types/events'

const { t } = useI18n()
const liveStreamStore = useLiveStreamStore()
const lexiconStore = useLexiconStore()

const loading = ref(false)

const strings = {
  title: t('events.liveStream.title'),
  events: t('events.events'),
}

onMounted(async () => {
  loading.value = true
  await lexiconStore.initEventsAndProperties()

  liveStreamStore.activeColumns = ['event_id', 'created_at', 'event'].map(name => {
    const eventProperty = lexiconStore.findEventPropertyByName(name)

    const property: PropertyRef = {
      name: name,
      type: PropertyType.Event,
    }

    if (eventProperty) {
      property.id = eventProperty.id
    }

    return property
  })

  loading.value = false
  liveStreamStore.getReportLiveStream()
})
</script>

<style lang="scss"></style>
