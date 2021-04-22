import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { Exclude, Expose } from 'class-transformer'
import { Types } from 'mongoose'
import { Gender } from 'src/constants'
import { Attendance, Education, EmploymentLevel, EmploymentType } from 'src/constants/job'
import { OmitType } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { CompanyDto, SimpleCompanyDto } from '@modules/company/company.dto'

export class JobDto {
  @IsInt()
  id?: number

  @IsInt()
  readCount?: number

  @IsString()
  status!: string

  @IsDate()
  expiredDate?: Date

  @IsDate()
  announcedDate?: Date

  @IsString()
  name!: string

  // @IsEnum(JobType)
  // type!: string

  @IsString()
  descriptions!: string

  @IsString()
  type!: string

  @IsNumber()
  positions!: number

  @IsBoolean()
  disability!: boolean

  @IsBoolean()
  workFromHome!: boolean

  @IsEnum(Gender)
  gender!: string

  @IsNumber()
  minAge!: number

  @IsNumber()
  maxAge!: number | null

  @IsNumber()
  workExperience!: number

  @IsEnum(Education)
  education!: string

  @IsString()
  qualifications?: string

  @IsNumber()
  minSalary!: number

  @IsNumber()
  maxSalary!: number

  @IsBoolean()
  negotiable!: boolean

  @IsBoolean()
  salaryDisplay!: boolean

  @IsEnum(EmploymentType)
  employmentType!: string

  @IsEnum(EmploymentLevel)
  employmentLevel!: string

  @IsEnum(Attendance)
  attendance!: string

  @IsArray()
  requiredSkills!: Array<string>

  @IsArray()
  otherSkills?: Array<string>

  @Exclude()
  updatedAt?: Date

  @Exclude()
  createdAt?: Date

  @Exclude()
  _id?: Types.ObjectId

  @Exclude()
  __v?: any
}

export class SimpleJobDto extends JobDto {
  constructor(job: SimpleJobDto) {
    super()
    Object.assign(this, job)
  }

  @Exclude()
  company?: any

  @IsString()
  status!: string
}

@Exclude()
export class ShortJobDto extends JobDto {
  constructor(job: ShortJobDto) {
    super()
    Object.assign(this, job)
  }

  @Expose()
  id!: number

  @Expose()
  createdAt!: Date

  @Expose()
  minSalary!: number

  @Expose()
  maxSalary!: number

  @Expose()
  negotiable!: boolean

  @Expose()
  salaryDisplay!: boolean

  @Expose()
  positions!: number

  @Expose()
  company!: Types.ObjectId | SimpleCompanyDto

  @Expose()
  @IsString()
  status!: string
}

export class CreateJobDto extends OmitType(JobDto, ['id', 'status', 'expiredDate', 'announcedDate']) {
  @IsInt()
  companyId!: number
}

export class UpdateJobDto extends OmitType(JobDto, ['status', 'expiredDate', 'announcedDate']) {}

export class DeleteDto {
  @IsInt()
  id!: number
}

@Exclude()
export class JobListDto extends OmitType(JobDto, ['_id']) {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  status!: string

  @Expose()
  expiredDate?: Date

  @Expose()
  announcedDate?: Date

  @Exclude()
  updatedAt?: Date

  @Exclude()
  createdAt?: Date

  @Exclude()
  __v?: any
}

export class JobPaginateDto extends JobListDto {
  @IsOptional()
  @IsArray()
  items?: JobListDto[]

  @IsInt()
  total?: number

  @IsInt()
  limit?: number

  @IsInt()
  totalPages?: number

  @IsInt()
  page?: number
}
