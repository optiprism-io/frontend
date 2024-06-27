import { ref } from 'vue'

import { apiClient } from '@/api/apiClient'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Property } from '@/api'

const useLexicon = () => {
  const projectsStore = useProjectsStore()

  return {}
}

export default useLexicon
