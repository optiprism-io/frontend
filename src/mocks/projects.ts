import { faker } from '@faker-js/faker'
import { Project } from '@/server/models/Project'

export default faker.helpers.multiple(() => new Project(), { count: { min: 2, max: 5 } })
