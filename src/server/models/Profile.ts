import { faker } from '@/server/faker'

import type { Profile as IProfile } from '@/api'

export class Profile implements IProfile {
  name: IProfile['name']
  email: IProfile['email']
  forceUpdatePassword: IProfile['forceUpdatePassword']
  forceUpdateEmail: IProfile['forceUpdateEmail']

  constructor(profile: Partial<IProfile> = {}) {
    this.name = profile.name || faker.person.fullName()
    this.email = profile.email || faker.internet.email()
    this.forceUpdatePassword = profile.forceUpdatePassword ?? true
    this.forceUpdateEmail = profile.forceUpdateEmail ?? true
  }
}
