<template>
  <div class="pf-u-p-md pf-u-pb-3xl">
    <ToolsLayout>
      <template #title>
        {{ $t('integration.title') }}
      </template>
      <template #main>
        <UiCard class="pf-c-card pf-m-compact pf-u-h-100">
          <UiSpinner
            v-if="isLoading"
            class="pf-u-display-flex pf-u-m-auto"
            size="lg"
          />
          <div v-else class="pf-l-flex pf-u-align-items-center pf-m-nowrap">
            <UiTabs
              class="pf-u-mb-md"
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
import UiCard from '@/components/uikit/UiCard/UiCard.vue'
import ToolsLayout from '@/layout/ToolsLayout.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'
import { computed, inject } from 'vue'
import { pagesMap, SDKIntegration } from '@/router'
import { useRoute, useRouter } from 'vue-router'
import IntegrationContent from '@/components/integration/IntegrationContent.vue'
import IntegrationContentJS from '@/components/integration/IntegrationContentJS.vue'
import { useProjectsStore } from '@/stores/projects/projects'
import { storeToRefs } from 'pinia'
import UiSpinner from '@/components/uikit/UiSpinner.vue'
import UiAlert from '@/components/uikit/UiAlert.vue'
import { AlertTypeEnum } from '@/types'
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
