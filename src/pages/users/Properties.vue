<template>
  <ToolsLayout>
    <template #title>
      {{ strings.users }}
    </template>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
        <UiTable
          :items="items"
          :columns="columns"
          :show-select-columns="false"
          :show-toolbar="false"
          @on-action="onAction"
        />
      </UiCardContainer>
    </template>
  </ToolsLayout>
  <UserPropertyPopup
    v-if="lexiconStore.userPropertyPopup"
    :property="editProperty"
    :show-apply="false"
    @cancel="userPropertyPopupCancel"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import UserPropertyPopup from '@/components/events/UserPropertyPopup.vue'
import UiCellTags from '@/components/uikit/cells/UiCellTags.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import useI18n from '@/hooks/useI18n'
import { useCommonStore } from '@/stores/common'
import { useLexiconStore } from '@/stores/lexicon'

import type { Property } from '@/api'
import type { Action, Row } from '@/components/uikit/UiTable/UiTable'

const { t } = useI18n()
const lexiconStore = useLexiconStore()
const commonStore = useCommonStore()

const strings = computed(() => {
  return {
    users: t('users.properties'),
    editProperty: t('events.editProperty'),
  }
})

const columns = computed(() => {
  return ['name', 'displayName', 'description', 'tags', 'status'].map(key => {
    const isAction = key === 'action'

    return {
      value: key,
      title: isAction ? '' : t(`events.event_management.columns.${key}`),
      default: isAction,
      type: isAction ? 'action' : '',
    }
  })
})

const items = computed(() => {
  return lexiconStore.groupProperties.flat().map((property: Property): Row => {
    return [
      {
        key: 'name',
        title: property.name,
        nowrap: true,
        component: UiTablePressedCell,
        action: {
          group: property.groupId ?? 0,
          type: 'edit',
          name: property.name,
          value: property.id,
        },
      },
      {
        key: 'displayName',
        title: property.displayName || '',
        nowrap: true,
      },
      {
        key: 'description',
        title: property.description || '',
      },
      {
        key: 'tags',
        title: 'tags',
        value: property.tags || [],
        nowrap: Boolean(property.tags?.length || 0 <= 5),
        component: UiCellTags,
      },
      {
        key: 'status',
        title: property.status,
      },
    ]
  })
})

const editProperty = ref<Property | null>(null)

const showPropertyPopup = () => {
  lexiconStore.userPropertyPopup = true
}
const hidePropertyPopup = () => {
  lexiconStore.userPropertyPopup = false
}

const onAction = (payload: Action) => {
  if (payload?.type === 'edit') {
    const property = lexiconStore.findGroupProperty(payload.name)
    if (property) {
      commonStore.editEventPropertyPopupId = Number(payload.value) || null
      editProperty.value = property
      showPropertyPopup()
    }
  }
}

const userPropertyPopupCancel = () => {
  hidePropertyPopup()
  editProperty.value = null
}

onMounted(async () => {
  lexiconStore.getEventProperties()
  await lexiconStore.getGroups()
  lexiconStore.getGroupProperties()
})
</script>
