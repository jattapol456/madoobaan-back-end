import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'
import * as mongoose from 'mongoose'
import mongoosePaginate = require('mongoose-paginate-v2')

@Schema({ timestamps: true })
export class Announce extends Base {
  constructor(Announce?: Announce) {
    super()
    Object.assign(this, Announce)
  }


  @Prop()
  type!: string

  @Prop()
  project?: string

  @Prop()
  province!: string

  @Prop()
  district!: string

  @Prop()
  subdistrict!: string

  @Prop()
  zipcode!: string

  @Prop()
  house_number!: string

  @Prop()
  swine!: string

  @Prop()
  alley!: string

  @Prop()
  road!: string

  @Prop()
  contact_person_name!: string

  @Prop()
  phone_number!: string

  @Prop()
  email?: string

  @Prop()
  facebook?: string

  @Prop()
  line_id?: string

  @Prop()
  number_layers?: string

  @Prop()
  number_bedroom!: string

  @Prop()
  number_toilet!: string

  @Prop()
  number_parking!: string

  @Prop()
  home_direction?: string

  @Prop()
  furniture?: string

  @Prop()
  number_rai!: string

  @Prop()
  number_tasks!: string

  @Prop()
  number_Square_wah!: string

  @Prop()
  number_Square_meters!: string
  
  @Prop()
  sale_price!: string

  @Prop()
  rental_commonfee_to_month?: string

  @Prop()
  room_status?: string

  @Prop()
  agent?: string

  @Prop()
  common_fee?: string[]

  @Prop()
  security?: string[]

  @Prop()
  exercise_facilities?: string[]

  @Prop()
  topic_name!: string

  @Prop()
  announcement_code?: string

  @Prop()
  more_details!: string

  @Prop()
  cover_photo!: string

  @Prop()
  photo?: string
}

export type AnnounceDocument = Announce & BaseDocument

export const AnnounceSchema = SchemaFactory.createForClass(Announce)

AnnounceSchema.plugin(mongoosePaginate)