<template>
    <UiPopupWindow
        :title="title"
        :apply-loading="props.loading"
        class="event-management-popup"
        :apply-button="$t('common.save')"
        :cancel-button="$t('common.close')"
        :apply-disabled="applyDisabled"
        @apply="apply"
        @cancel="cancel"
    >
        <div class="event-management-popup__content">
            <UiDescriptionList
                v-if="activeTab === 'property'"
                :items="propertyItems"
                :horizontal="true"
                @on-input="onInputPropertyItem"
            />
        </div>
    </UiPopupWindow>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { Property } from '@/api';

import UiPopupWindow from '@/components/uikit/UiPopupWindow.vue'
import UiDescriptionList, { Item, ActionPayload } from '@/components/uikit/UiDescriptionList.vue'
import { Action } from '@/components/uikit/UiTable/UiTable'
import { propertyValuesConfig, Item as PropertyValueConfig, DisplayName } from '@/configs/events/eventValues'
import { useCommonStore, PropertyTypeEnum } from '@/stores/common'

export type EventObject = {
    [key: string]: string | string[] | boolean
}
export type ApplyPayload = EventObject;

const commonStore = useCommonStore();

const i18n = inject<any>('i18n')

type Props = {
    name?: string,
    loading?: boolean,
    property: Property | null,
};

const props = withDefaults(defineProps<Props>(), {
    name: '',
})

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'apply', payload: ApplyPayload): void
    (e: 'on-action-event', payload: Action): void
}>()

const activeTab = ref('property')

const editProperty = ref<EventObject | null>(null)
const applyDisabled = computed(() => !editProperty.value)

const title = computed(() => props.property ? `${i18n.$t('events.event_management.popup.tabs.property')}: ${props.property.name}` : '')

const propertyItems = computed<Item[]>(() => {
    const items: Item[] = [];
    const property = props.property;
    if (property) {
        const keys = (Object.keys(propertyValuesConfig) as (keyof typeof props.property)[])

        keys.forEach(key => {
            const config: PropertyValueConfig = propertyValuesConfig[key];
            let value = editProperty.value && key in editProperty.value ? editProperty.value[key] : property[key] ||property[key];
            let label: string = i18n.$t(config.string)
            let name: string = key

            if (commonStore.editEventPropertyPopupType === PropertyTypeEnum.UserProperty && key === DisplayName) {
                value = property.name
                label = i18n.$t('events.event_management.columns.name')
                name = 'name'
            }

            if (key === 'status') {
                value = property[key] === 'enabled'
            }

            if (key === 'type') {
                value = property.isArray ? i18n.$t('common.list_of', { type: i18n.$t(`common.types.${property.dataType}`) }) : i18n.$t(`common.types.${property.dataType}`)
            }

            const item: Item = {
                label,
                key: name,
                value,
                component: config.component || 'p'
            }

            items.push(item)
        })
    }

    return items
})

const apply = () => {
    if (editProperty.value) {
        emit('apply', editProperty.value)
    }
}

const cancel = () => {
    emit('cancel')
}

const onInputPropertyItem = async (payload: ActionPayload) => {
    let value = payload.value

    if (payload.key === 'status') {
        value = payload.value ? 'enabled' : 'disabled'
    }

    if (editProperty.value) {
        editProperty.value[payload.key] = value
    } else {
        editProperty.value = {
            [payload.key]: value
        }
    }
}
</script>