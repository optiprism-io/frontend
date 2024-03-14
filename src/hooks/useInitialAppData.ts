import { useProjectsStore } from '@/stores/projects/projects'
import { useProfileStore } from '@/stores/profile/profile'

export const useInitialAppData = () => {
  const profileStore = useProfileStore()
  const projectStore = useProjectsStore()

  function loadAppData() {
    return Promise.all([profileStore.getProfile(), loadProjectStore()])
  }

  return {
    loadAppData,
  }

  async function loadProjectStore() {
    await projectStore.init()
    await projectStore.getProject()
  }
}
