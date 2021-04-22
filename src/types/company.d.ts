import { User } from '@schemas/user.schema'
import { AdminRole } from 'src/constants/user'

export type UserCompany = User & {
  role: AdminRole
}
