import { faker } from '@/server/faker'
import { Project } from '@/server/models/Project'

export default faker.helpers.multiple(() => new Project(), { count: { min: 0, max: 0 } })
