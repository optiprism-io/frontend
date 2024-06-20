import { ref } from 'vue'

import { apiClient } from '@/api/apiClient'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Property } from '@/api'

const useLexicon = () => {
  const projectsStore = useProjectsStore()

  const systemPropertiesLoading = ref(false)
  const systemProperties = ref<Property[]>([])

  const getSystemProperties = async () => {
    systemPropertiesLoading.value = true
    try {
      const res = await apiClient.systemProperties.systemPropertiesList(projectsStore.projectId)

      if (res?.data?.data) {
        systemProperties.value = res.data.data
      }
    } catch (e) {
      console.error('Error Get System Properties')
    }
    systemPropertiesLoading.value = true
  }

  return {
    systemPropertiesLoading,
    systemProperties,

    getSystemProperties,
  }
}

export default useLexicon