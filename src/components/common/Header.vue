<template>
  <header class="app-header">
    <div class="pf-l-flex pf-u-align-items-center">
      <div class="pf-l-flex__item pf-u-ml-md pf-l-flex pf-u-align-items-center">
        <router-link class="app-header__logo" to="/dashboards" aria-current="page">
          <img class="pf-c-brand" src="@/assets/img/logo-black.svg" alt="OptiPrism" />
        </router-link>
      </div>
      <div class="pf-l-flex__item">
        <Nav />
      </div>
      <RouterLink
        v-if="!projectStore.project?.eventsCount"
        class="pf-c-button pf-m-small pf-m-warning"
        :to="{
          name: pagesMap.integration,
          params: { integration: SDKIntegration.javascript },
        }"
      >
        <UiIcon icon="fas fa-exclamation-circle" />
        {{ $t('integration.clickIntegrate') }}
      </RouterLink>
      <div
        class="app-header__tools"
        :class="{
          'pf-m-align-r': !viteMockApi,
        }"
      >
        <div class="pf-c-page__header-tools-group">
          <div class="pf-c-page__header-tools-item">
            <UiSelect
              class="pf-u-mr-md app-header__project-select"
              :items="projectStore.projectList"
              :text-button="activeProjectName"
              :placement="'bottom-end'"
              :is-text-select="true"
              :selections="projectListSelected"
              @on-select="selectProject"
            />
          </div>
          <div class="pf-c-page__header-tools-item pf-u-ml-md pf-u-mr-lg">
            <UiDropdown
              class=""
              :items="userMenu"
              :text-button="''"
              :transparent="true"
              :has-icon-arrow-button="false"
              :button-icon="'gear'"
              :placement-menu="'bottom-end'"
              @select-value="selectUserMenu"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { GenericUiDropdown, UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import Nav from '@/components/common/Nav.vue'
import { useAuthStore } from '@/stores/auth/auth'
import { useDashboardsStore } from '@/stores/dashboards'
import { RouterLink, useRouter } from 'vue-router'
import { pagesMap, SDKIntegration } from '@/router'
import { useProjectsStore } from '@/stores/projects/projects'
import UiIcon from '@/components/uikit/UiIcon.vue'

const authStore = useAuthStore()
const dashboardsStore = useDashboardsStore()
const projectStore = useProjectsStore()
const router = useRouter()
const i18n = inject<any>('i18n')
const UiDropdown = GenericUiDropdown<MenuValues>()

const userMenuMap = {
  PROFILE: 'profile',
  ORGANIZATION: 'organization',
  PROJECT: 'project',
  INTEGRATION: 'integration',
  LOGOUT: 'logout',
} as const

type MenuValues = (typeof userMenuMap)[keyof typeof userMenuMap]

const userMenu = computed<UiDropdownItem<MenuValues>[]>(() => {
  return [
    {
      key: 1,
      value: userMenuMap.PROFILE,
      to: { name: pagesMap.profile },
      nameDisplay: i18n.$t('userMenu.personalSettings'),
    },
    {
      key: 2,
      value: userMenuMap.ORGANIZATION,
      nameDisplay: i18n.$t('userMenu.organizationSettings'),
    },
    {
      key: 3,
      value: userMenuMap.PROJECT,
      nameDisplay: i18n.$t('userMenu.projectSettings'),
      to: { name: pagesMap.projectsSettings, params: { id: projectStore.projectId } },
    },
    {
      key: 4,
      value: userMenuMap.INTEGRATION,
      nameDisplay: i18n.$t('userMenu.integrateOptiPrism'),
      to: { name: pagesMap.integration, params: { integration: SDKIntegration.javascript } },
    },
    {
      key: 5,
      value: userMenuMap.LOGOUT,
      nameDisplay: i18n.$t('userMenu.logout'),
    },
  ]
})

const selectUserMenu = (item: UiDropdownItem<MenuValues>) => {
  switch (item.value) {
    case userMenuMap.LOGOUT:
      authStore.reset()
      authStore.$reset()
      dashboardsStore.$reset()
      projectStore.$reset()
      router.replace({ name: 'login' })
      break
  }
}

const selectProject = (value: number) => {
  if (value !== projectStore.projectId) {
    projectStore.setProjectId(value)
    location.reload()
  }
}

const projectListSelected = computed(() => {
  return projectStore.projectId ? [projectStore.projectId] : []
})

const activeProjectName = computed(() => {
  return projectStore.selectedProject
    ? projectStore.selectedProject.name
    : i18n.$t('project.selectProject')
})

/**
 * mocks env store
 */
const isEnabledMocks = ref(false)
const viteMockApi = import.meta.env.VITE_MOCK_API
const changeMocks = () => {
  localStorage.setItem('isEnabledMocks', isEnabledMocks.value ? '0' : '1')
  location.reload()
}

const isEmptyMocks = ref(false)
const onClearStore = () => {
  localStorage.setItem('isEmptyMocks', isEmptyMocks.value ? '0' : '1')
  location.reload()
}

onMounted(() => {
  isEnabledMocks.value = localStorage.getItem('isEnabledMocks') === '1'
  isEmptyMocks.value = localStorage.getItem('isEmptyMocks') === '1'
})
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--pf-global--ZIndex--2xl);
  grid-area: header;
  background-color: var(--op-base-color);
  &__tools {
    margin-left: auto;
    display: flex;
    color: #fff;
  }
  &__logo {
    display: inline-block;
    width: 30px;
    height: 24px;
    margin-top: 4px;
    overflow: hidden;
    img {
      width: 130px;
      max-width: initial;
    }
  }
  &__project-select {
    width: 190px;
  }
}
</style>
