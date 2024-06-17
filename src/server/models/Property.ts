import { faker } from '@/server/faker'

import type { Property as IProperty } from '@/api'

export class Property implements IProperty {
  id: IProperty['id']
  createdAt: IProperty['createdAt']
  updatedAt: IProperty['updatedAt']
  createdBy: IProperty['createdBy']
  updatedBy: IProperty['updatedBy']
  projectId: IProperty['projectId']
  events: IProperty['events']
  tags: IProperty['tags']
  name: IProperty['name']
  description: IProperty['description']
  type: IProperty['type']
  groupId: IProperty['groupId']
  dataType: IProperty['dataType']
  status: IProperty['status']
  hidden: IProperty['hidden']
  isSystem: IProperty['isSystem']
  nullable: IProperty['nullable']
  isArray: IProperty['isArray']
  isDictionary: IProperty['isDictionary']
  dictionaryType: IProperty['dictionaryType']
  constructor(property: Partial<IProperty> = {}) {
    this.id = property.id || faker.number.int({ min: 1, max: 1000 })
    this.createdAt = property.createdAt || faker.date.past({ years: 3 }).toISOString()
    this.updatedAt = property.updatedAt || this.createdAt
    this.createdBy = property.createdBy || faker.number.int({ min: 1, max: 1000 })
    this.updatedBy = property.updatedBy || this.createdBy
    this.projectId = property.projectId || faker.number.int({ min: 1, max: 1000 })
    this.type = property.type || 'system'
    this.name = property.name || faker.commerce.productName()
    this.dataType = property.dataType || 'string'
    this.status = property.status || 'enabled'
    this.isSystem = property.isSystem || true
    this.nullable = property.nullable || false
    this.isArray = property.isArray || false
    this.isDictionary = property.isDictionary || false
  }
}
