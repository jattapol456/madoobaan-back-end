import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Exclude, Expose } from 'class-transformer'
import { Types } from 'mongoose'
import { FileType } from 'src/constants/fileType'

export class FileDto {
  @IsInt()
  id?: number

  @IsString()
  name?: string

  @IsEnum(FileType)
  type!: string

  @IsInt()
  referenceId!: number

  @IsString()
  urlS?: string

  @IsString()
  urlM?: string

  @IsString()
  url!: string

  @Exclude()
  updatedAt?: Date

  @Exclude()
  createdAt?: Date

  @Exclude()
  _id?: Types.ObjectId

  @Exclude()
  __v?: any
}

export class SimpleFileDto extends FileDto {
  constructor(file: SimpleFileDto) {
    super()
    Object.assign(this, file)
  }
}

export class DocumentFileDto extends FileDto {
  constructor(file: SimpleFileDto) {
    super()
    Object.assign(this, file)
  }

  @Exclude()
  urlS: any

  @Exclude()
  urlM: any

  @Exclude()
  referenceId: any

  @Exclude()
  type: any
}
