import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'
import * as mongoose from 'mongoose'

import mongoosePaginate = require('mongoose-paginate-v2')

@Schema({ timestamps: true })
export class Zone extends Base {
  constructor(zone?: Zone) {
    super()
    Object.assign(this, zone)
  }

  @Prop({ unique: false })
  subdistrict_name!: string
  
  @Prop()
  subdistrict_id!: number

  @Prop()
  img!: string

  @Prop()
  province_id!: number

  @Prop()
  province!: string

  @Prop()
  district!: string

  @Prop()
  district_id!: number

  @Prop()
  zipcode!: number
}

export type ZoneDocument = Zone & BaseDocument

export const ZoneSchema = SchemaFactory.createForClass(Zone)

ZoneSchema.plugin(mongoosePaginate)
