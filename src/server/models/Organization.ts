import { Organization as IOrganization } from '@/api'
import { faker } from '@faker-js/faker'

export class Organization implements IOrganization {
  id: IOrganization['id']
  name: IOrganization['name']

  constructor(organization: Partial<IOrganization> = {}) {
    this.id = organization.id || faker.number.int({ min: 1, max: 1000 })
    this.name = organization.name || faker.company.name()
  }
}
