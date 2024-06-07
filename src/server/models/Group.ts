import { Group as IGroup } from '@/api'
import { faker } from '@/server/faker'

export class Group implements IGroup {
  id: IGroup['id']
  name: IGroup['name']

  constructor(group: Partial<IGroup> = {}) {
    this.id = group.id || faker.number.int({ min: 1, max: 5 })
    this.name = group.name || faker.person.jobType()
  }
}
