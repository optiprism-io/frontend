<template>
  <header class="app-header">
    <div class="pf-l-flex pf-u-align-items-center">
      <div class="pf-l-flex__item pf-u-ml-md">
        <router-link class="app-header__logo" to="/dashboards" aria-current="page">
          <img class="pf-c-brand" src="@/assets/img/logo-black.svg" alt="OptiPrism" />
        </router-link>
      </div>
      <!-- <div class="pf-l-flex__item">
            <UiSelect
                class=" pf-u-mr-md dashboards__add-report"
                :items="projectList"
                :text-button="'TODO Name'"
                :placement="'bottom-end'"
                :is-text-select="true"
                @on-select="selectProject"
            />
      </div> -->
      <div class="pf-l-flex__item">
        <Nav />
      </div>
      <RouterLink
        v-if="!projectStore.project?.eventsCount"
        class="pf-c-button pf-m-small pf-m-warning"
        :to="{ name: pagesMap.integration, params: { integration: SDKIntegration.javascript } }"
      >
        <UiIcon icon="fas fa-exclamation-circle" />
        Click here to integrate and start using OptiPrism
      </RouterLink>
      <div
        class="app-header__tools"
        :class="{
          'pf-m-align-r': !viteMockApi,
        }"
      >
        <div class="pf-c-page__header-tools-group">
          <div v-if="viteMockApi" class="pf-c-page__header-tools-item pf-u-mr-lg">
            <UiSwitch
              class="pf-m-reverse pf-c-switch-white"
              :value="isEmptyMocks"
              :label="'Mocks empty'"
              @input="onClearStore"
            />
          </div>
          <div v-if="viteMockApi" class="pf-c-page__header-tools-item pf-u-mr-lg">
            <UiSwitch
              class="pf-m-reverse pf-c-switch-white"
              :value="isEnabledMocks"
              :label="'Mocks enabled'"
              @input="changeMocks"
            />
          </div>
          <div class="pf-c-page__header-tools-item">
            <UiDropdown
              class="pf-u-mr-lg"
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
import { h, inject, onMounted, ref } from 'vue'
import { GenericUiDropdown, UiDropdownItem } from '@/components/uikit/UiDropdown.vue'
import Nav from '@/components/common/Nav.vue'
import UiSwitch from '@/components/uikit/UiSwitch.vue'
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

const userMenu: UiDropdownItem<MenuValues>[] = [
  {
    key: 1,
    value: userMenuMap.PROFILE,
    vNode: h(RouterLink, { to: { name: pagesMap.profile } }, () =>
      i18n.$t('userMenu.personalSettings')
    ),
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
    vNode: h(
      RouterLink,
      {
        to: { name: pagesMap.projectsSettings, params: { id: projectStore.projectId } },
      },
      () => i18n.$t('userMenu.projectSettings')
    ),
  },
  {
    key: 4,
    value: userMenuMap.INTEGRATION,
    nameDisplay: i18n.$t('userMenu.integrateOptiPrism'),
    vNode: h(
      RouterLink,
      {
        to: { name: pagesMap.integration, params: { integration: SDKIntegration.javascript } },
      },
      () => i18n.$t('userMenu.integrateOptiPrism')
    ),
  },
  {
    key: 5,
    value: userMenuMap.LOGOUT,
    nameDisplay: i18n.$t('userMenu.logout'),
  },
]

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
    margin-top: 14px;
    overflow: hidden;
    img {
      width: 130px;
      max-width: initial;
    }
  }
}
</style>
