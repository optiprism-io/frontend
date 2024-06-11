import { faker } from '@/server/faker'

import type { Profile as IProfile } from '@/api'

export class Profile implements IProfile {
  id: IProfile['id']
  name: IProfile['name']
  email: IProfile['email']
  timezone: IProfile['timezone']

  constructor(profile: Partial<IProfile> = {}) {
    this.id = profile.id || faker.number.int({ min: 1, max: 1000 })
    this.name = profile.name || faker.person.fullName()
    this.email = profile.email || faker.internet.email()
    this.timezone = profile.timezone || 'utc'
  }
}
