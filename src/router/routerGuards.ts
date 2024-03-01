import { useProjectsStore } from '@/stores/projects/projects'
import { pagesMap } from '@/router/index'
import { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'

type NavigationGuard = NavigationGuardWithThis<undefined>

export const checkCreatedProject: NavigationGuard = async (to, from) => {
  const projectStore = useProjectsStore()
  await projectStore.init()
  if (!projectStore.projectList.length) return { name: pagesMap.createProject }
  return true
}

export const isAuth: NavigationGuard = (to, from) => {
  const authStore = useAuthStore()
  authStore.authAccess()
  if (!authStore.isAuthenticated) return { name: pagesMap.login.name }
  return true
}
