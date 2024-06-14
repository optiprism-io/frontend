<template>
  <UiPopupWindow
    :title="title"
    :apply-loading="loading"
    class="live-stream-event-popup"
    @cancel="cancel"
  >
    <UiTabs class="pf-u-mb-md" :items="itemsTabs" />
    <div class="live-stream-event-popup__content">
      <UiTable
        :compact="true"
        :items="items"
        :columns="columns"
        :show-toolbar="false"
        :no-data-text="noDataText"
        :is-loading="loading"
      />
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { apiClient } from "@/api/apiClient";
import { useProjectsStore } from "@/stores/projects/projects";
import { EventRecord } from "@/api";
import { getStringDateByFormat } from '@/helpers/getStringDates';

import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue';
import UiTable from '@/components/uikit/UiTable/UiTable.vue';
import UiTabs from '@/components/uikit/UiTabs.vue'
import type { Row } from '@/components/uikit/UiTable/UiTable';

import usei18n from '@/hooks/useI18n';
import { useLiveStreamStore } from '@/stores/reports/liveStream';

const projectsStore = useProjectsStore();
const liveStreamStore = useLiveStreamStore();
const { t } = usei18n();

type Props = {
  id: number;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "apply"): void;
}>();

const activeTab = ref('eventProperties');
const loading = ref(false);
const event = ref<EventRecord | null>(null);

const items = computed(() => {
  const eventProperties = event.value?.eventProperties || {};
  const userProperties = event.value?.userProperties || {};

  const property = activeTab.value === 'eventProperties' ? eventProperties : userProperties;

  return property ? Object.keys(property).map((key): Row => {
    return [
        {
              key: 'name',
              title: key === 'createdAt' ? t('events.liveStream.columns.createdAt') : key
          },
          {
              key: 'value',
              title: key === 'createdAt' ? getStringDateByFormat(String(property[key]), '%d %b, %Y') : property[key],
          }
    ]
  }) : []
});

const columns = computed(() => {
  return ['name', 'value'].map((key) => {
    return {
      value: key,
      title: t(`events.event_management.columns.${key}`),
    };
  });
});

const title = computed(() => {
  return event.value?.name
    ? `${t("events.event_management.event")}: ${event.value.name}`
    : "";
});

const itemsTabs = computed(() => {
  return ['eventProperties', 'userProperties'].map((key) => {
    return {
      name: t(`events.liveStream.popupTabs.${key}`),
      active: activeTab.value === key,
      value: key,
    };
  });
});

const noDataText = computed(() => {
  return t("common.eventNoProperties");
});

const cancel = () => {
  emit("cancel");
  liveStreamStore.eventPopup = false;
};

const getEvent = async () => {
  loading.value = true;
  const res = await apiClient.eventRecords.getEventRecord(
    projectsStore.projectId,
    props.id
  );

  if (res.data) {
    event.value = res.data;
  }
  loading.value = false;
};

onMounted(async () => {
  if (props.id) {
    getEvent();
  }
});
</script>

<style lang="scss">
.live-stream-event-popup {
  .pf-c-modal-box__body {
    min-height: 316px;
  }
}
</style>

