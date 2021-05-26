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
  subDistrictName!: string
  
  @Prop()
  subdistrict!: number

  @Prop()
  img!: string

  @Prop()
  province!: number

  @Prop()
  provinceName!: string

  @Prop()
  district!: string

  @Prop()
  districtName!: string

  @Prop()
  zipcode!: number
}

export type ZoneDocument = Zone & BaseDocument

export const ZoneSchema = SchemaFactory.createForClass(Zone)

ZoneSchema.plugin(mongoosePaginate)
