<template>
  <div class="pf-v5-u-p-md pf-v5-u-pb-3xl">
    <ToolsLayout>
      <template #title>
        {{ $t('integration.title') }}
      </template>
      <template #main>
        <UiCard class="pf-v5-c-card pf-v5-m-compact pf-v5-u-h-100">
          <UiSpinner
            v-if="isLoading"
            class="pf-v5-u-display-flex pf-v5-u-m-auto"
            size="lg"
          />
          <div v-else class="pf-v5-l-flex pf-v5-u-align-items-center pf-v5-m-nowrap">
            <UiTabs
              class="pf-v5-u-mb-md"
              :items="tabs"
              :is-vertical="true"
              @on-select="onSelectTab"
            />
            <IntegrationContent>
              <UiAlert v-if="!projectsStore.project?.eventsCount" :item="alert" />

              <IntegrationContentJS
                v-if="activeTab === SDKIntegration.javascript"
                :sdk-token="project?.sdkToken"
              />
            </IntegrationContent>
          </div>
        </UiCard>
      </template>
    </ToolsLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import IntegrationContent from '@/components/integration/IntegrationContent.vue'
import IntegrationContentJS from '@/components/integration/IntegrationContentJS.vue'
import UiAlert from '@/components/uikit/UiAlert.vue'
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'

import { AlertTypeEnum } from '@/hooks/useAlert'
import { pagesMap, SDKIntegration } from '@/router'
import { useProjectsStore } from '@/stores/projects/projects'
import { generateUUID } from '@/utils/generateUuid'

const route = useRoute()
const router = useRouter()
const i18n = inject<any>('i18n')

const projectsStore = useProjectsStore()
const { project, isLoading } = storeToRefs(projectsStore)

const activeTab = computed(() => route.params.integration)

const tabs = computed(() => [
  {
    name: i18n.$t('integration.javascript'),
    value: SDKIntegration.javascript,
    active: activeTab.value === SDKIntegration.javascript,
    disabled: false,
    tooltip: '',
  },
  {
    name: i18n.$t('integration.android'),
    value: SDKIntegration.android,
    active: activeTab.value === SDKIntegration.android,
    disabled: true,
    tooltip: i18n.$t('common.comingSoon'),
  },
  {
    name: i18n.$t('integration.ios'),
    value: SDKIntegration.ios,
    active: activeTab.value === SDKIntegration.ios,
    disabled: true,
    tooltip: i18n.$t('common.comingSoon'),
  },
])

const alert = {
  id: generateUUID(),
  type: AlertTypeEnum.Info,
  text: i18n.$t('integration.noEventsText'),
  noClose: true,
}

function onSelectTab(integration: string) {
  router.push({ name: pagesMap.integration, params: { integration } })
}
</script>
