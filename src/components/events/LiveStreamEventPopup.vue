<template>
  <UiPopupWindow
    :title="title"
    :apply-loading="props.loading"
    class="live-stream-event-popup"
    @apply="apply"
    @cancel="cancel"
  >
    <UiTabs
      class="pf-u-mb-md"
      :items="itemsTabs"
      @on-select="onSelectTab"
    />
    <div class="live-stream-event-popup__content">
      <UiTable
        :compact="true"
        :items="items"
        :columns="columns"
        :show-toolbar="false"
        :no-data-text="noDataText"
        :is-loading="props?.loading"
        @on-action="onActionProperty"
      />
    </div>
  </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue';
import UiTable from '@/components/uikit/UiTable/UiTable.vue';
import UiTabs from '@/components/uikit/UiTabs.vue'

import usei18n from '@/hooks/useI18n';
import { useCommonStore, PropertyTypeEnum } from '@/stores/common';
import { useLexiconStore } from '@/stores/lexicon';
import { useLiveStreamStore } from '@/stores/reports/liveStream';

import type { Action } from '@/components/uikit/UiTable/UiTable';

const liveStreamStore = useLiveStreamStore();
const commonStore = useCommonStore();
const lexiconStore = useLexiconStore();
const { t } = usei18n();

type Props = {
    name: string,
    loading?: boolean,
};

const properties = 'properties';
const userProperties = 'userProperties';

const mapTabs = [properties, userProperties]

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'apply'): void
}>()

const activeTab = ref(properties)

const items = computed(() => {
    // const objItems = liveStreamStore.columns.map(item => item.name)

    return [];
    // if (objItems) {
    //     return Object.keys(objItems).map((key): Row => {
    //         return [
    //             {
    //                 key: 'name',
    //                 title: key === createdAt ? t('events.live_stream.columns.createdAt') : activeTab.value === properties ? key.charAt(0).toUpperCase() + key.slice(1) : key,
    //                 component: UiTablePressedCell,
    //                 action: {
    //                     type: activeTab.value === userProperties ? PropertyTypeEnum.UserProperty : PropertyTypeEnum.EventProperty,
    //                     name: key,
    //                 }
    //             },
    //             {
    //                 key: 'value',
    //                 title: key === createdAt ? getStringDateByFormat(String(objItems[key]), '%d %b, %Y') : objItems[key],
    //             }
    //         ]
    //     })
    // } else {
    //     return []
    // }
})

const columns = computed(() => {
    return ['name', 'value'].map(key => {
        return {
            value: key,
            title: t(`events.event_management.columns.${key}`),
        }
    })
})

const title = computed(() => {
    return `${t('events.event_management.event')}: ${props.name}`
})

const itemsTabs = computed(() => {
    return mapTabs.map(key => {
        return {
            name: t(`events.live_stream.popupTabs.${key}`),
            active: activeTab.value === key,
            value: key,
        }
    })
});

const noDataText = computed(() => {
    return t(activeTab.value === properties ? 'common.eventNoProperties' : 'common.eventNoUserProperties');
});

const onSelectTab = (payload: string) => {
    activeTab.value = payload
}

const apply = () => {
    emit('apply')
}

const cancel = () => {
    emit('cancel')
    liveStreamStore.eventPopup = false
}

const onActionProperty = (payload: Action) => {
    let property = null
    if (payload.type === PropertyTypeEnum.UserProperty) {
        commonStore.editEventPropertyPopupType = payload.type
        property = lexiconStore.findGroupProperty(payload.name);
    } else {
        commonStore.editEventPropertyPopupType = PropertyTypeEnum.EventProperty
        property = lexiconStore.findEventPropertyByName(payload.name);
    }
    commonStore.editEventPropertyPopupId = property?.id || null
    liveStreamStore.eventPopup = false
    commonStore.showEventPropertyPopup = true
}
</script>

<style lang="scss">
.live-stream-event-popup {
    .pf-c-modal-box__body {
        min-height: 316px;
    }
}
</style>
