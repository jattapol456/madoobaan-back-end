import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { AdminRole } from 'src/constants/user'
import { Base, BaseDocument } from './base.schema'
import { CompanyDocument } from './company.schema'
import { UserDocument } from './user.schema'

@Schema({ timestamps: true })
export class UserCompany extends Base {
  constructor(userCompany?: UserCompany) {
    super()
    Object.assign(this, userCompany)
  }

  @Prop({ ref: 'User', type: Types.ObjectId, nullable: false })
  user!: Types.ObjectId | UserDocument

  @Prop({ ref: 'Company', type: Types.ObjectId, nullable: false })
  company!: Types.ObjectId | CompanyDocument

  @Prop({ nullable: false })
  role!: AdminRole
}

export type UserCompanyDocument = UserCompany & BaseDocument

export const UserCompanySchema = SchemaFactory.createForClass(UserCompany)
