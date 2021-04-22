import { Injectable } from '@nestjs/common'
import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability'
import { Action } from 'src/constants/action'
import { User } from '@schemas/user.schema'

type Subjects = InferSubjects<typeof User> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user?: User | null) {
    const { can, build } = new AbilityBuilder(Ability as AbilityClass<AppAbility>)

    can(Action.Update, User, { id: user?.id })

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
