<template>
  <ToolsLayout :col-lg="12">
    <template #title>
      {{ strings.title }}
    </template>
    <UiCard class="pf-c-card pf-m-compact pf-u-h-100" :title="strings.events">
      <InputsEventsLiveStream />
    </UiCard>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
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
import { useLiveStreamStore } from '@/stores/reports/liveStream'
import { PropertyType } from '@/api'
import { useLexiconStore } from '@/stores/lexicon'
import usei18n from '@/hooks/useI18n'

const { t } = usei18n()
const liveStreamStore = useLiveStreamStore()
const lexiconStore = useLexiconStore()

const loading = ref(false);

const strings = {
  title: t('events.liveStream.title'),
  events: t('events.events'),
}

onMounted(async () => {
  loading.value = true;
  await lexiconStore.initEventsAndProperties();


  liveStreamStore.activeColumns = ['event_id', 'created_at', 'event'].map(name => {
    const property = lexiconStore.systemProperties.find(item => item.name === name);
    return {
      id: property?.id,
      name: name,
      type: PropertyType.System,
    }
  });

  loading.value = false;
  liveStreamStore.getReportLiveStream()
})
</script>

<style lang="scss"></style>
