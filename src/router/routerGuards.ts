import { pagesMap } from '@/router/pagesMap'
import { useAuthStore } from '@/stores/auth/auth'
import { useProfileStore } from '@/stores/profile/profile'
import { useProjectsStore } from '@/stores/projects/projects'

import type { NavigationGuardWithThis, RouteLocationRaw } from 'vue-router'

type NavigationGuard = NavigationGuardWithThis<undefined>

export const checkRequiredParams: NavigationGuard = async (_to, _from) => {
  const profileStore = useProfileStore()
  const projectStore = useProjectsStore()

  await Promise.all([profileStore.getProfile(), projectStore.init()])

  const forceUpdateEmail = !!profileStore.profile.forceUpdateEmail
  const forceUpdatePassword = !!profileStore.profile.forceUpdatePassword
  const forceUpdateProject = !projectStore.projectList.length

  if (forceUpdateEmail || forceUpdatePassword || forceUpdateProject)
    return {
      name: pagesMap.forceUpdateProfile,
      query: {
        email: forceUpdateEmail.toString(),
        password: forceUpdatePassword.toString(),
        project: forceUpdateProject.toString(),
      },
    } satisfies RouteLocationRaw
  return true
}

export const isAuth: NavigationGuard = (_to, _from) => {
  const authStore = useAuthStore()
  authStore.authAccess()
  if (!authStore.isAuthenticated) return { name: pagesMap.login.name }
  return true
}
