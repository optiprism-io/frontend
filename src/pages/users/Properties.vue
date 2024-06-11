<template>
  <ToolsLayout>
    <template #title>
      {{ $t('users.properties') }}
    </template>
    <template #main>
      <UiCardContainer class="pf-u-h-100">
        <UiTable
          :items="items"
          :columns="columns"
          :show-select-columns="true"
          @on-action="onAction"
        />
      </UiCardContainer>
    </template>
  </ToolsLayout>
  <UserPropertyPopup
    v-if="lexiconStore.userPropertyPopup"
    :property="editProperty"
    @apply="userPropertyPopupApply"
    @cancel="userPropertyPopupCancel"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLexiconStore } from '@/stores/lexicon'
import { useCommonStore } from '@/stores/common'
import ToolsLayout from '@/layout/ToolsLayout.vue'
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue'
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue'
import UiCellTags from '@/components/uikit/cells/UiCellTags.vue'
import UiCellToolMenu from '@/components/uikit/cells/UiCellToolMenu.vue'
import { Property } from '@/api'
import { Action, Row } from '@/components/uikit/UiTable/UiTable'
import usei18n from '@/hooks/useI18n'
import UserPropertyPopup, { ApplyPayload } from '@/components/events/UserPropertyPopup.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'

const { t } = usei18n()
const lexiconStore = useLexiconStore()
const commonStore = useCommonStore()

const columns = computed(() => {
  return ['name', 'displayName', 'description', 'tags', 'status', 'action'].map(key => {
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
          type: Number(property.id),
          name: 'edit',
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
      {
        title: 'action',
        key: 'action',
        value: Number(property.id),
        component: UiCellToolMenu,
        items: [
          {
            label: t('events.editProperty'),
            value: 'edit',
          },
        ],
        type: 'action',
      },
    ]
  })
})

const editProperty = ref<Property | null>(null)
const popupLoading = ref(false)

const setStatePopup = (payload: boolean) => {
  lexiconStore.userPropertyPopup = payload
}

const onAction = (payload: Action) => {
  if (payload?.name === 'edit' && typeof payload.type === 'number') {
    const property = lexiconStore.findGroupProperty(payload.type)
    if (property) {
      commonStore.editEventPropertyPopupId = Number(payload.type) || null
      editProperty.value = property
      setStatePopup(true)
    }
  }
}

const updateData = () => {
  lexiconStore.getGroupProperties()
}

const userPropertyPopupApply = async (payload: ApplyPayload) => {
  popupLoading.value = true
  await lexiconStore.updateUserProperty(payload)
  popupLoading.value = false
  commonStore.editEventPropertyPopupId = null
  updateData()
  setStatePopup(false)
  editProperty.value = null
}

const userPropertyPopupCancel = () => {
  setStatePopup(false)
  editProperty.value = null
}

onMounted(() => {
  updateData()
})
</script>

