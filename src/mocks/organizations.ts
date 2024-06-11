import { faker } from '@/server/faker'
import { Organization } from '@/server/models/Organization'

export const orgId = 1

export const organizations = faker.helpers.multiple(() => new Organization({ id: orgId }), {
  count: 1,
})
