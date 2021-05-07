import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'
import * as mongoose from 'mongoose'

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
  postal_code!: number

  @Prop()
  house_number!: number

  @Prop()
  swine!: number

  @Prop()
  alley!: string

  @Prop()
  road!: string

  @Prop()
  latitude!: string

  @Prop()
  สongitude!: string

  @Prop()
  contact_person_name!: string

  @Prop()
  phone_number!: number

  @Prop()
  email?: string

  @Prop()
  facebook?: string

  @Prop()
  line_id?: string

  @Prop()
  number_layers?: number

  @Prop()
  number_bedroom!: number

  @Prop()
  number_toilet!: number

  @Prop()
  number_parking!: number

  @Prop()
  home_direction?: string

  @Prop()
  furniture?: string

  @Prop()
  number_rai!: number

  @Prop()
  number_tasks!: number

  @Prop()
  number_Square_wah!: number

  @Prop()
  number_Square_meters!: number

  @Prop()
  Rental_price_to_month!: number

  @Prop()
  Rental_commonfee_to_month?: number

  @Prop()
  room_status?: string

  @Prop()
  agent?: string

  @Prop()
  Common_fee?: string

  @Prop()
  security?: string

  @Prop()
  exercise_facilities?: string

  @Prop()
  topic_name!: string

  @Prop()
  announcement_code?: number

  @Prop()
  more_details!: string

  @Prop()
  cover_photo!: string

  @Prop()
  photo?: string
}

export type AnnounceDocument = Announce & BaseDocument

export const AnnounceSchema = SchemaFactory.createForClass(Announce)
