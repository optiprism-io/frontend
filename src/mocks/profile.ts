import { ADMIN_EMAIL } from '@/server/constants'
import { Profile } from '@/server/models/Profile'

export const userId = 1

export default new Profile({ email: ADMIN_EMAIL })
