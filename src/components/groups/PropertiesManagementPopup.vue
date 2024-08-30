<template>
  <UiPopupWindow
    :title="title"
    :apply-loading="props.loading"
    class="properties-management-popup"
    :apply-button="strings.save"
    :cancel-button="strings.close"
    :apply-disabled="applyDisabled"
    @apply="apply"
    @cancel="cancel"
  >
    <div class="properties-management-popup__content">
      <div
        v-show="isLoadingSaveProperties"
        class="properties-management-popup__loading"
      >
        <UiSpinner :size="'xl'" />
      </div>
      <UiTabs
        class="pf-u-mb-md"
        :items="itemsTabs"
      />
      <PropertiesManagementLine
        class="properties-management-popup__line"
        :hide-controls="true"
        :bold-text="true"
        :no-edit="true"
        :value="strings.usersValue"
        :value-key="strings.usersKey"
      />
      <PropertiesManagementLine
        v-for="(property, i) in itemsProperties"
        :key="i"
        class="properties-management-popup__line pf-u-mb-md"
        :hide-controls="false"
        :index="i"
        :value="property.value"
        :value-key="property.key"
        :error-key="property.error"
        @apply="onApplyChangeProperty"
        @delete="onDeleteLine"
      />
      <UiButton
        class="pf-m-primary pf-u-mt-md"
        @click="onAddProperty"
      >
        {{ strings.addProperty }}
      </UiButton>
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

import type { ApplyPayload } from './PropertiesManagementLine.vue'
import PropertiesManagementLine from './PropertiesManagementLine.vue'
import UiButton from '@/components/uikit/UiButton.vue'
import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'

import useI18n from '@/hooks/useI18n'
import { useGroupStore } from '@/stores/group/group'

import type { Value, GroupRecord } from '@/api'

export type Properties = {
  [key: string]: Value
}

type PropertiesEdit = {
  value: Value
  key: string
  error?: boolean
}

const { t } = useI18n()
const groupStore = useGroupStore()
const mapTabs = ['userProperties']

type Props = {
  item: GroupRecord | null
  itemIndex?: number
  loading?: boolean
}

const strings = computed(() => {
  return {
    user: t('users.user'),
    usersValue: t('users.columns.value'),
    usersKey: t('users.columns.key'),
    addProperty: t('common.addProperty'),
    save: t('common.save'),
    close: t('common.close'),
  }
})

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'cancel'): void
}>()

const activeTab = ref('userProperties')
const isLoadingSaveProperties = ref(false)
const propertiesEdit = ref<PropertiesEdit[]>([])

const title = computed(() => `${strings.value.user}: ${props.itemIndex}`)
const itemsTabs = computed(() => {
  return mapTabs.map(key => {
    return {
      name: t(`events.event_management.popup.tabs.${key}`),
      active: activeTab.value === key,
      value: key,
    }
  })
})

const itemsProperties = computed(() => {
  return propertiesEdit.value.map((item, i) => {
    return {
      key: item.key,
      value: item.value || ('' as Value),
      error: item.error,
      index: i,
    }
  })
})

const properties = computed(() => {
  return itemsProperties.value.reduce((acc: Properties, item) => {
    acc[item.key] = item.value
    return acc
  }, {})
})

const applyDisabled = computed(() => {
  return JSON.stringify(properties.value) === JSON.stringify(props.item?.properties)
})

const onApplyChangeProperty = async (payload: ApplyPayload) => {
  if (props.itemIndex) {
    propertiesEdit.value[payload.index] = {
      key: payload.valueKey,
      value: payload.value,
      error: !payload.valueKey.trim(),
    }
  }
}

const onAddProperty = () => {
  propertiesEdit.value.push({
    key: '',
    value: '',
  })
}

const onDeleteLine = async (index: number) => {
  if (props.itemIndex) {
    propertiesEdit.value.splice(index, 1)
  }
}

const checkError = () => {
  propertiesEdit.value = propertiesEdit.value.map(item => {
    return {
      ...item,
      error: !item.key.trim(),
    }
  })
}

const cancel = () => {
  emit('cancel')
}

const apply = async () => {
  if (props.itemIndex) {
    const error = propertiesEdit.value.findIndex(item => !item.key.trim())

    if (error === -1) {
      isLoadingSaveProperties.value = true
      await groupStore.update(
        props.itemIndex,
        propertiesEdit.value.reduce((acc: Properties, item) => {
          acc[item.key] = item.value
          return acc
        }, {}),
        true
      )
      emit('apply')
      groupStore.propertyPopup = false
    } else {
      checkError()
    }
  }
}

onMounted(() => {
  propertiesEdit.value = props.item?.properties
    ? Object.keys(props.item.properties).map(key => {
        return {
          value: props.item?.properties.find(item => item?.propertyName === key)?.value || '',
          key: key || '',
        }
      })
    : []
})

onUnmounted(() => {
  isLoadingSaveProperties.value = false
})
</script>

<style lang="scss">
.properties-management-popup {
  .pf-c-table {
    margin-right: 80px;
  }
  &__content {
    position: relative;
  }
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(#fff, 0.6);
    z-index: 2;
  }
}
</style>
