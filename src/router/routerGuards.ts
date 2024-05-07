import { useProjectsStore } from '@/stores/projects/projects'
import { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { pagesMap } from '@/router/pagesMap'

type NavigationGuard = NavigationGuardWithThis<undefined>

export const checkCreatedProject: NavigationGuard = async (_to, _from) => {
  const projectStore = useProjectsStore()
  await projectStore.init()
  if (!projectStore.projectList.length) return { name: pagesMap.createProject }
  return true
}

export const isAuth: NavigationGuard = (_to, _from) => {
  const authStore = useAuthStore()
  authStore.authAccess()
  if (!authStore.isAuthenticated) return { name: pagesMap.login.name }
  return true
}
