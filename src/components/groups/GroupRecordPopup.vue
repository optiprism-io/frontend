<template>
  <UiPopupWindow
    :title="title"
    class="group-record-popup"
    @cancel="cancel"
  >
    <div class="group-record-popup__content">
      <UiSpinner v-if="loading" />
      <UiTable
        v-else
        class="group-record-popup__table"
        :compact="true"
        :items="items"
        :columns="columns"
        :show-toolbar="false"
        :no-data-text="strings.eventNoProperties"
        :is-loading="loading"
      />
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'

import { useDateFormat } from '@vueuse/core'

import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiTable from '@/components/uikit/UiTable/UiTable.vue'

import { apiClient } from '@/api/apiClient'
import useI18n from '@/hooks/useI18n'
import { useProjectsStore } from '@/stores/projects/projects'

import type { GroupRecord } from '@/api'
import type { Row } from '@/components/uikit/UiTable/UiTable'

const projectsStore = useProjectsStore()
const { t } = useI18n()

const props = defineProps<{
  group: number
  id: string
  name: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'apply'): void
}>()

const strings = {
  eventNoProperties: t('common.eventNoProperties'),
}

const loading = ref(true)
const record = ref<GroupRecord | null>(null)
const properties = computed(() => record.value?.properties || [])

const title = computed(() => {
  return t('events.liveStream.popup.title', {
    name: props.name,
  })
})

const items = computed<Row[]>(() => {
  return properties.value.map((item): Row => {
    return [
      {
        key: 'name',
        title: item?.propertyName || '',
      },
      {
        key: 'value',
        title:
          item?.value && item?.propertyName === 'created_at'
            ? useDateFormat(+item?.value, 'YYYY-MM-DD HH:mm').value
            : item?.value || '',
      },
    ]
  })
})

const columns = computed(() => {
  return ['name', 'value'].map(key => {
    return {
      value: key,
      title: t(`events.event_management.columns.${key}`),
    }
  })
})

const cancel = () => {
  emit('cancel')
}

const getData = async () => {
  loading.value = true
  try {
    const res = await apiClient.groupRecords.getGroupRecord(
      projectsStore.projectId,
      props.group,
      props.id
    )
    if (res.data) {
      record.value = res.data
    }
  } catch (e) {
    loading.value = false
    throw new Error('error request getGroupRecord')
  }

  loading.value = false
}

onMounted(async () => {
  if (props.id) {
    await getData()
  }
})
</script>

<style lang="scss">
.group-record-popup {
  .pf-c-modal-box__body {
    min-height: 316px;
  }
  &__table {
    th {
      width: 50%;
    }
  }
}
</style>
