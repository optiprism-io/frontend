<template>
  <ToolsLayout>
    <template #title>
      {{ $t('events.customEvents.title') }}
    </template>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
        <UiTable
          :items="items"
          :columns="columns"
          :no-data-text="$t('events.noEventsText')"
          @on-action="onAction"
        >
          <template #before>
            <UiButton class="pf-m-primary" @click="addCustomEvent">
              {{ $t('events.add_custom_event') }}
            </UiButton>
          </template>
        </UiTable>
      </UiCardContainer>
    </template>
  </ToolsLayout>
  <ConfirmPopup
    v-if="openConfirmPopup && actionEventId"
    :title="confirmPopupDeleteInfo.title"
    :content="confirmPopupDeleteInfo.content"
    :apply-button="$t('common.delete')"
    apply-button-class="pf-m-danger"
    @apply="applyDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'

import ConfirmPopup from '@/components/common/ConfirmPopup.vue'
import UiCellTags from '@/components/uikit/cells/UiCellTags.vue'
import UiCellToolMenu from '@/components/uikit/cells/UiCellToolMenu.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { apiClient } from '@/api/apiClient'
import { useCommonStore } from '@/stores/common'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useLexiconStore } from '@/stores/lexicon'
import { useProjectsStore } from '@/stores/projects/projects'

import type { CustomEvent } from '@/api'
import type { Row, Action } from '@/components/uikit/UiTable/UiTable'

const i18n = useI18n()
const lexiconStore = useLexiconStore()
const eventsStore = useEventsStore()
const commonStore = useCommonStore()
const projectsStore = useProjectsStore()

const actionEventId = ref<number | null>(null)
const openConfirmPopup = ref(false)

const actionEvent = computed(() => {
  if (actionEventId.value) {
    return lexiconStore.findCustomEventById(actionEventId.value)
  } else {
    return null
  }
})

const confirmPopupDeleteInfo = computed(() => {
  const info = {
    title: '',
    content: '',
  }

  if (actionEvent.value) {
    info.title = `${i18n.t('events.customEvents.deleteTitle')}: ${actionEvent.value?.name}`
    info.content = i18n.t('events.customEvents.deleteContent', {
      name: `<b>${actionEvent.value?.name}</b>`,
    })
  }

  return info
})

const columns = computed(() => {
  return ['name', 'description', 'tags', 'status', 'action'].map(key => {
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
  return lexiconStore.customEvents.map((event: CustomEvent): Row => {
    return [
      {
        key: 'name',
        value: event.name,
        title: event.name,
        component: UiTablePressedCell,
        action: {
          type: event.id,
          name: 'edit',
        },
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
        title: event.status || '',
        key: 'status',
      },
      {
        title: 'action',
        key: 'action',
        value: event.id,
        component: UiCellToolMenu,
        items: [
          {
            label: i18n.t('common.edit'),
            value: 'edit',
          },
          {
            label: i18n.t('common.delete'),
            value: 'delete',
          },
        ],
        type: 'action',
      },
    ]
  })
})

const onAction = (payload: Action) => {
  if (payload.name === 'edit') {
    eventsStore.setEditCustomEvent(Number(payload.type))
    commonStore.togglePopupCreateCustomEvent(true)
  }

  if (payload.name === 'delete') {
    actionEventId.value = Number(payload.type)
    openConfirmPopup.value = true
  }
}

const addCustomEvent = () => {
  eventsStore.setEditCustomEvent(null)
  commonStore.togglePopupCreateCustomEvent(true)
}

const applyDelete = async () => {
  if (actionEventId.value) {
    try {
      await apiClient.customEvents.deleteCustomEvent(projectsStore.projectId, actionEventId.value)
      lexiconStore.deleteCustomEvent(actionEventId.value)
    } catch (e) {
      throw new Error('error Delete Custom Events')
    }
  }
  openConfirmPopup.value = false
}

const cancelDelete = () => {
  openConfirmPopup.value = false
}

onMounted(async () => {
  await lexiconStore.initEventsAndProperties()
})
</script>
