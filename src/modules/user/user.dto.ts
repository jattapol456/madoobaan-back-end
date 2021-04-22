import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator'
import { Types } from 'mongoose'
import { Gender } from 'src/constants'
import { IEditable } from 'src/types'

export class UserDto {
  @IsInt()
  id!: number

  @IsEmail()
  email!: string

  @IsOptional()
  @IsEmail()
  displayEmail?: string

  @IsBoolean()
  verified!: boolean

  @IsString()
  firstname!: string

  @IsString()
  lastname!: string

  @IsString()
  @IsOptional()
  firstnameEN!: string

  @IsOptional()
  @IsString()
  lastnameEN!: string

  @IsOptional()
  @IsString()
  descriptions?: string

  @IsOptional()
  @IsUrl()
  avatar!: string

  @IsString()
  tel!: string

  @IsEnum(Gender)
  gender?: string

  @IsOptional()
  @IsString()
  province!: string

  @IsOptional()
  @IsString()
  district!: string

  @IsOptional()
  @IsString()
  subDistrict!: string

  @IsOptional()
  @IsString()
  zipcode!: string

  @IsOptional()
  @IsString()
  nationality!: string

  @IsOptional()
  @IsString()
  status!: string

  @IsOptional()
  @IsArray()
  workCities!: string[]

  @IsOptional()
  @IsInt()
  expectedSalary!: number

  @Type(() => Date)
  @IsDate()
  birthdate!: Date

  updatedAt?: Date

  createdAt?: Date

  @Exclude()
  _id?: Types.ObjectId

  @Exclude()
  __v?: any
}

export class SimpleUserDto extends UserDto {
  constructor(user: SimpleUserDto) {
    super()
    Object.assign(this, user)
  }
}

export class EditableSimpleUserRequestDto extends PartialType(OmitType(UserDto, ['id', 'verified', 'email'])) {}

export class EditableSimpleUserDto extends SimpleUserDto implements IEditable {
  constructor(user: EditableSimpleUserDto) {
    super(user)
    Object.assign(this, user)
  }

  editable!: boolean
}

export class UserSetupDto extends PickType(SimpleUserDto, ['firstname', 'lastname', 'gender', 'tel']) {}
