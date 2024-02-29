import { Organization } from '@/server/models/Organization'
import { faker } from '@faker-js/faker'

export const orgId = 1

export const organizations = faker.helpers.multiple(() => new Organization({ id: orgId }), {
  count: 1,
})
