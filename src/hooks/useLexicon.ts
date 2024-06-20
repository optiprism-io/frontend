import { ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects/projects'
// import { errorHandler } from '@/helpers/errorHandlerHelper'
import { apiClient } from '@/api/apiClient'
import { Property, PropertyRef } from '@/api'

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
