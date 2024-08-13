import { pagesMap } from '@/router/pagesMap'
import { useAuthStore } from '@/stores/auth/auth'
import { useProfileStore } from '@/stores/profile/profile'
import { useProjectsStore } from '@/stores/projects/projects'

import type { NavigationGuardWithThis } from 'vue-router'

type NavigationGuard = NavigationGuardWithThis<undefined>

export const checkChangedPassOrEmail: NavigationGuard = async (_to, _from) => {
  const profileStore = useProfileStore()
  await profileStore.getProfile()
  if (profileStore.profile.forceUpdatePassword || profileStore.profile.forceUpdateEmail) return { name: pagesMap.forceUpdateProfile }
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
