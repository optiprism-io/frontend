<template>
  <ToolsLayout :col-lg="12">
    <template #title>
      {{ $t('events.live_stream.title') }}
    </template>
    <UiCard class="filter-event-segmentation__item">
      <UiSelect
        v-if="selectedGroup?.name"
        :items="selectGroups"
        :width-auto="true"
        :selections="[selectedGroup.id]"
        @on-select="onSelectGroup"
      >
        <template #action>
          <UiButton
            :is-link="true"
            :after-icon="'fas fa-chevron-down'"
          >
            {{ selectedGroupByString }}
          </UiButton>
        </template>
      </UiSelect>
    </UiCard>
    <UiCard class="pf-c-card pf-m-compact pf-u-h-100" :title="$t('events.events')">
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
import { computed, onMounted } from 'vue'
import { useLiveStreamStore } from '@/stores/reports/liveStream'
import { useLexiconStore } from '@/stores/lexicon'
import usei18n from '@/hooks/useI18n';
import { useGroup } from '@/hooks/useGroup'

import InputsEventsLiveStream from '@/components/events/LiveStream/InputsEventsLiveStream.vue'
import TableLiveStream from '@/components/events/LiveStream/TableLiveStream.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'

const { t } = usei18n()
const liveStreamStore = useLiveStreamStore()
const lexiconStore = useLexiconStore()
const { selectGroups } = useGroup()

const selectedGroup = computed(() => lexiconStore.groups.find(item => item.id === liveStreamStore.group))
const selectedGroupByString = computed(() => `${t('common.group', { name: selectedGroup.value?.name })}`)

const onSelectGroup = (id: number) => {
  liveStreamStore.group = id
  liveStreamStore.getReportLiveStream()
}

onMounted(() => {
  liveStreamStore.group = 0
})
</script>

<style lang="scss"></style>
