import { faker } from '@/server/faker'

import type { Project as IProject } from '@/api'

export class Project implements IProject {
  id: IProject['id']
  createdAt: IProject['createdAt']
  updatedAt: IProject['updatedAt']
  createdBy: IProject['createdBy']
  creator: IProject['creator']
  updatedBy: IProject['updatedBy']
  name: IProject['name']
  sessionDurationSeconds: IProject['sessionDurationSeconds']
  sdkToken: IProject['sdkToken']
  eventsCount: IProject['eventsCount']

  constructor(project: Partial<IProject> = {}) {
    this.id = project.id || faker.number.int({ min: 1, max: 1000 })
    this.createdAt = project.createdAt || faker.date.past({ years: 3 }).toISOString()
    this.updatedAt = project.updatedAt || this.createdAt
    this.createdBy = project.createdBy || faker.number.int({ min: 1, max: 1000 })
    this.creator = project.creator || faker.person.fullName()
    this.updatedBy = project.updatedBy || this.createdBy
    this.name = project.name || faker.company.name()
    this.sessionDurationSeconds =
      project.sessionDurationSeconds || faker.number.int({ min: 0, max: 24 }) * 60 * 60
    this.sdkToken = project.sdkToken || faker.string.uuid()
    this.eventsCount = project.eventsCount || faker.number.int({ min: 1, max: 10 })
  }
}
