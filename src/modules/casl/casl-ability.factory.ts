import { Injectable } from '@nestjs/common'
import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, subject } from '@casl/ability'
import { Action } from 'src/constants/action'
import { User } from '@schemas/user.schema'
import { UserCompany } from '@schemas/user-company.schema'
import { AdminRole } from 'src/constants/user'

type Subjects = InferSubjects<typeof User | typeof UserCompany> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user?: User | null) {
    const { can, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>)

    can(Action.Update, User, { id: user?.id })
    can(Action.Update, UserCompany, { user: user?._id, role: AdminRole.OWNER })
    can(Action.Create, UserCompany, { user: user?._id, role: AdminRole.OWNER })
    can(Action.Read, UserCompany, { user: user?._id, role: AdminRole.OWNER })

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
