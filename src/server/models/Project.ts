import { Project as IProject } from '@/api'
import { getRandomValue } from '@/utils/getRandomValue'
import { generateUUID } from '@/utils/generateUuid'

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

  constructor(project: Partial<IProject>) {
    this.id = project.id || getRandomValue()
    this.createdAt = project.createdAt || Date.now().toString()
    this.updatedAt = project.updatedAt || Date.now().toString()
    this.createdBy = project.createdBy || Date.now()
    this.creator = project.creator || 'admin'
    this.updatedBy = project.updatedBy || Date.now()
    this.name = project.name || ''
    this.sessionDurationSeconds = project.sessionDurationSeconds || 86400
    this.sdkToken = project.sdkToken || generateUUID()
    this.eventsCount = project.eventsCount || 0
  }
}
