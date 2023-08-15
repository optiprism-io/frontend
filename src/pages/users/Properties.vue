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
</template>

<script setup lang="ts" name="Properties">
import { computed, onMounted } from 'vue';
import { useLexiconStore } from '@/stores/lexicon';
import ToolsLayout from '@/layout/tools/ToolsLayout.vue';
import UiCardContainer from '@/components/uikit/UiCard/UiCardContainer.vue';
import UiTablePressedCell from '@/components/uikit/UiTable/UiTablePressedCell.vue';
import UiCellTags from '@/components/uikit/cells/UiCellTags.vue';
import UiCellToolMenu from '@/components/uikit/cells/UiCellToolMenu.vue';
import { Property } from '@/api';
import { Action, Row }  from '@/components/uikit/UiTable/UiTable';
import usei18n from '@/hooks/useI18n';

const lexiconStore = useLexiconStore();
const { t } = usei18n();

const columns = computed(() => {
    return ['name', 'displayName', 'description', 'tags', 'status', 'action'].map(key => {
        const isAction = key === 'action'

        return {
            value: key,
            title: isAction ? '' : t(`events.event_management.columns.${key}`),
            default: isAction,
            type: isAction? 'action' : '',
        };
    });
});

const items = computed(() => {
    return lexiconStore.userProperties.map((property: Property): Row => {
        return [
            {
                key: 'name',
                title: property.name,
                component: UiTablePressedCell,
                action: {
                    type: property.id,
                    name: property.name,
                }
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
                value: property.id,
                component: UiCellToolMenu,
                items: [
                    {
                        label: t('events.editProperty'),
                        value: 'edit',
                    },
                ],
                type: 'action'
            }
        ]
    })
})

const onAction = (payload: Action) => {
    // TODO
};

const updateData = () => {
    lexiconStore.getUserProperties();
};

onMounted(() => {
    updateData();
});
</script>