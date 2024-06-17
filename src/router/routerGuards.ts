import { useProjectsStore } from '@/stores/projects/projects'
import { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { pagesMap } from '@/router/pagesMap'
import { useProfileStore } from '@/stores/profile/profile'

type NavigationGuard = NavigationGuardWithThis<undefined>

export const checkChangedPass: NavigationGuard = async (_to, _from) => {
  const profileStore = useProfileStore()
  await profileStore.getProfile()
  if (profileStore.profile.forceUpdatePassword) return { name: pagesMap.forceUpdatePassword }
  return true
}

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
