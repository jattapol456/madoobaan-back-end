import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Base, BaseDocument } from './base.schema'
import { FileDocument } from './file.schema'
import { JobDocument } from './job.schema'
import { UserDocument } from './user.schema'

import mongoosePaginate = require('mongoose-paginate-v2')

@Schema({ timestamps: true })
export class ApplyJob extends Base {
  @Prop({ ref: 'User', type: Types.ObjectId, nullable: false })
  user!: Types.ObjectId | UserDocument

  @Prop({ ref: 'Job', type: Types.ObjectId, nullable: false })
  job!: Types.ObjectId | JobDocument

  @Prop({ default: null })
  expectedSalary?: number

  @Prop({ default: null })
  introduce?: string

  @Prop({ ref: 'file', nullable: true, default: [] })
  files!: Array<Types.ObjectId | FileDocument>
}

export type ApplyJobDocument = ApplyJob & BaseDocument

export const ApplyJobSchema = SchemaFactory.createForClass(ApplyJob)

ApplyJobSchema.plugin(mongoosePaginate)
