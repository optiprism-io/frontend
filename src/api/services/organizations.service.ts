import { OrganizationsApi } from '@/api'
import { config } from '@/api/services/config'

const api = new OrganizationsApi(config)

export const schemaOrganizations = {
  getOrganizationList: async () => await api.organizationsList(),
  getOrganization: async (id: number) => await api.organization(id),
}
