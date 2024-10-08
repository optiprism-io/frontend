<template>
  <ToolsLayout>
    <template #title>
      {{ $t('events.events') }}
    </template>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
        <UiTable
          :items="items"
          :columns="columns"
          :no-data-text="$t('events.noEventsText')"
          @on-action="onAction"
        />
      </UiCardContainer>
    </template>
  </ToolsLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'

import UiCellTags from '@/components/uikit/cells/UiCellTags.vue'
import UiCellToolMenu from '@/components/uikit/cells/UiCellToolMenu.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { useCommonStore } from '@/stores/common'
import { useLexiconStore } from '@/stores/lexicon'

import type { Event } from '@/api'
import type { Row, Action } from '@/components/uikit/UiTable/UiTable'

const i18n = useI18n()
const lexiconStore = useLexiconStore()
const commonStore = useCommonStore()

const columns = computed(() => {
  return ['name', 'displayName', 'description', 'tags', 'status', 'action'].map(key => {
    const isAction = key === 'action'

    return {
      value: key,
      title: isAction ? '' : i18n.t(`events.event_management.columns.${key}`),
      default: isAction,
      type: isAction ? 'action' : '',
    }
  })
})

const items = computed(() => {
  return lexiconStore.events.map((event: Event): Row => {
    return [
      {
        key: 'name',
        value: 'name',
        title: event.name,
        component: UiTablePressedCell,
        action: {
          type: event.id,
          name: event.name,
        },
      },
      {
        key: 'displayName',
        title: event.displayName || '',
        nowrap: true,
      },
      {
        key: 'description',
        title: event.description || '',
      },
      {
        key: 'tags',
        title: 'tags',
        value: event.tags || [],
        nowrap: Boolean(event.tags?.length || 0 <= 5),
        component: UiCellTags,
      },
      {
        key: 'status',
        title: event.status || '',
      },
      {
        title: 'action',
        key: 'action',
        value: event.id,
        component: UiCellToolMenu,
        items: [
          {
            label: i18n.t('events.editEvent'),
            value: 'edit',
          },
        ],
        type: 'action',
      },
    ]
  })
})

const onAction = (payload: Action) => {
  commonStore.updateEditEventManagementPopupId(Number(payload.type) || null)
  commonStore.toggleEventManagementPopup(true)
}

onMounted(async () => {
  await lexiconStore.initEventsAndProperties()
})
</script>
