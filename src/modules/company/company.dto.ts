import { IsArray, IsInt, IsOptional, IsString, IsUrl } from 'class-validator'
import { PartialType, PickType } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { IEditable } from 'src/types'

export class CompanyDto {
  @IsInt()
  id!: number

  @IsOptional()
  @IsUrl()
  profileUrl?: string

  @IsString()
  nameTH!: string

  @IsString()
  nameEN!: string

  @IsString()
  businessType!: string

  @IsString()
  numberOfEmployee!: string

  @IsString()
  about!: string

  @IsString()
  welfare!: string

  @IsString()
  address!: string

  @IsString()
  explainPathTH!: string

  @IsString()
  explainPathEN!: string

  @IsString()
  latitude!: string

  @IsString()
  longitude!: string

  @IsOptional()
  @IsArray()
  imgUrls!: string[]

  @IsOptional()
  @IsString()
  imageProfileUrlS?: string

  @IsOptional()
  @IsString()
  imageProfileUrlM?: string

  @IsOptional()
  @IsString()
  imageProfileUrl?: string

  @Exclude()
  updatedAt?: Date

  @Exclude()
  createdAt?: Date

  @Exclude()
  _id?: any

  @Exclude()
  __v?: any

  constructor(company?: CompanyDto) {
    Object.assign(this, company)
  }
}

@Exclude()
export class SimpleCompanyDto extends PickType(CompanyDto, ['id', 'profileUrl', 'nameTH', 'nameEN']) {
  @Expose()
  id!: number

  @Expose()
  nameTH!: string

  @Expose()
  nameEN!: string

  @Expose()
  address!: string

  @Expose()
  imageProfileUrlS?: string

  @Expose()
  imageProfileUrlM?: string

  @Expose()
  imageProfileUrl?: string
}

export class CreateCompanyDto extends PickType(CompanyDto, ['nameTH', 'nameEN', 'businessType', 'numberOfEmployee']) {}

export class PartialCompanyDto extends PartialType(CompanyDto) {}

export class EditableCompanyDto extends CompanyDto implements IEditable {
  editable!: boolean
}
