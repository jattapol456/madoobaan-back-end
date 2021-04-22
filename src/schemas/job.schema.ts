import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'
import { Types } from 'mongoose'
import { CompanyDocument } from './company.schema'

import mongoosePaginate = require('mongoose-paginate-v2')
import { Education, EmploymentLevel, EmploymentType, Attendance } from 'src/constants/job'
import { Gender, Status } from 'src/constants'

@Schema({ timestamps: true })
export class Job extends Base {
  @Prop({ ref: 'Company', type: Types.ObjectId, nullable: false })
  company!: Types.ObjectId | CompanyDocument

  @Prop({ default: Status.DRAFT })
  status!: string

  @Prop({ type: Date, default: null })
  expiredDate?: Date

  @Prop({ default: 0 })
  readCount!: number

  @Prop({ type: Date, default: null })
  announcedDate?: Date

  @Prop({ default: null })
  name!: string

  @Prop({ default: null })
  descriptions!: string

  @Prop({ default: null })
  type!: string

  @Prop({ default: 0 })
  positions!: number

  @Prop({ default: true })
  disability!: boolean

  @Prop({ default: true })
  workFromHome!: boolean

  @Prop({ default: Gender.MALE })
  gender!: string

  @Prop({ default: 18 })
  minAge!: number

  @Prop({ type: Number, default: null })
  maxAge!: number | null

  @Prop({ default: 0 })
  workExperience!: number

  @Prop({ default: Education.NOT_SPECIFIED })
  education!: string

  @Prop({ default: null })
  qualifications?: string

  @Prop({ default: null })
  minSalary!: number

  @Prop({ default: null })
  maxSalary!: number

  @Prop({ default: false })
  negotiable!: boolean

  @Prop({ default: false })
  salaryDisplay!: boolean

  @Prop({ default: EmploymentType.NORMAL })
  employmentType!: string

  @Prop({ default: EmploymentLevel.ENTRY })
  employmentLevel!: string

  @Prop({ default: Attendance.FIXED })
  attendance!: string

  @Prop({ default: [] })
  requiredSkills!: Array<string>

  @Prop({ default: [] })
  otherSkills?: Array<string>
}

export type JobDocument = Job & BaseDocument

export const JobSchema = SchemaFactory.createForClass(Job)

JobSchema.plugin(mongoosePaginate)
