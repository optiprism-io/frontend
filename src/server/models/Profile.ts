import { Profile as IProfile } from '@/api'
import { faker } from '@/server/faker'

export class Profile implements IProfile {
  name: IProfile['name']
  email: IProfile['email']
  timezone: IProfile['timezone']
  forceUpdatePassword: IProfile['forceUpdatePassword']

  constructor(profile: Partial<IProfile> = {}) {
    this.name = profile.name || faker.person.fullName()
    this.email = profile.email || faker.internet.email()
    this.timezone = profile.timezone || 'utc'
    this.forceUpdatePassword = profile.forceUpdatePassword ?? true
  }
}
