import { Exclude, Expose } from 'class-transformer'
import { IsEnum, IsNumber, IsString } from 'class-validator'
import { AdminRole } from 'src/constants/user'
import { Types } from 'mongoose'
import { UserDto } from '@modules/user/user.dto'
import { CompanyDto, SimpleCompanyDto } from '@modules/company/company.dto'

export class UserCompanyDto {
  constructor(user?: UserCompanyDto) {
    Object.assign(this, user)
  }

  @IsNumber()
  id?: number

  @IsNumber()
  user!: Types.ObjectId | UserDto

  @IsNumber()
  company!: Types.ObjectId | CompanyDto

  @IsString()
  @IsEnum(AdminRole)
  role!: AdminRole

  @Exclude()
  _id?: Types.ObjectId

  @Exclude()
  __v?: any
}

@Exclude()
export class SimpleUserCompanyDto extends SimpleCompanyDto {
  @Expose()
  role!: AdminRole
}
