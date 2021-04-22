import { FileDocument } from '@schemas/file.schema'
import { JobDocument } from '@schemas/job.schema'
import { UserDocument } from '@schemas/user.schema'
import { Exclude } from 'class-transformer'
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'

@Exclude()
export class ApplyJobDto {
  @IsInt()
  id!: number

  @IsNumber()
  job!: Types.ObjectId | JobDocument

  @IsNumber()
  user!: Types.ObjectId | UserDocument

  @IsArray()
  files?: Types.ObjectId[] | FileDocument[]

  @IsOptional()
  @IsNumber()
  expectedSalary?: number

  @IsOptional()
  @IsString()
  introduce?: string

  @Exclude()
  updatedAt?: Date

  @Exclude()
  createdAt?: Date

  @Exclude()
  _id?: any

  @Exclude()
  __v?: any
}

export class SimpleApplyJobDto extends ApplyJobDto {
  constructor(applyJob: SimpleApplyJobDto) {
    super()
    Object.assign(this, applyJob)
  }

  @Exclude()
  job: any

  @Exclude()
  user: any

  @Exclude()
  files: any
}

export class CreateApplyJob {
  @IsNumber()
  jobId!: number

  @IsNumber()
  expectedSalary?: number

  @IsString()
  introduce?: string

  @IsArray()
  fileIds!: Array<number>
}

export class ApplyJobDetailDto extends ApplyJobDto {
  constructor(applyJob: SimpleApplyJobDto) {
    super()
    Object.assign(this, applyJob)
  }

  @Exclude()
  job: any
}

export class ApplyJobPaginateDto extends ApplyJobDto {
  @IsArray()
  items?: ApplyJobDetailDto[]

  @IsInt()
  total?: number

  @IsInt()
  limit?: number

  @IsInt()
  totalPages?: number

  @IsInt()
  page?: number
}
