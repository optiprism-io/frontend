import { useProjectsStore } from '@/stores/projects/projects'
import { pagesMap, SDKIntegration } from '@/router/index'
import { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'

type NavigationGuard = NavigationGuardWithThis<undefined>

export const checkCreatedProject: NavigationGuard = async (to, from) => {
  const projectStore = useProjectsStore()
  await projectStore.init()
  if (!projectStore.projectId) return { name: pagesMap.createProject }
  return true
}

export const isAuth: NavigationGuard = (to, from) => {
  const authStore = useAuthStore()
  authStore.authAccess()
  if (!authStore.isAuthenticated) return { name: pagesMap.login.name }
  return true
}

export const checkIntegration: NavigationGuard = (to, from) => {
  const JsIntegrationRoute = {
    name: pagesMap.integration,
    params: { integration: SDKIntegration.javascript },
  }

  if (!Object.values(SDKIntegration).some(x => x === to.params.integration))
    return JsIntegrationRoute

  /* TODO: remove that when will exists ios and android integration page */
  if (to.params.integration !== SDKIntegration.javascript) return JsIntegrationRoute

  return true
}
