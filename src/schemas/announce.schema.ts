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
  houseNumber!: string

  @Prop()
  swine!: string

  @Prop()
  alley!: string

  @Prop()
  road!: string

  @Prop()
  contactPersonName!: string

  @Prop()
  phoneNumber!: string

  @Prop()
  email?: string

  @Prop()
  facebook?: string

  @Prop()
  lineId?: string

  @Prop()
  numberLayers?: string

  @Prop()
  numberBedroom!: string

  @Prop()
  bathroom!: string

  @Prop()
  numberParking!: string

  @Prop()
  homeDirection?: string

  @Prop()
  furniture?: string

  @Prop()
  numberRai!: string

  @Prop()
  numberTasks!: string

  @Prop()
  numberSquareWah!: string

  @Prop()
  numberSquareMeters!: string
  
  @Prop()
  salePrice!: string

  @Prop()
  rentalCommonfeeToMonth?: string

  @Prop()
  roomStatus?: string

  @Prop()
  agent?: string

  @Prop()
  commonFee?: string[]

  @Prop()
  security?: string[]

  @Prop()
  exerciseFacilities?: string[]

  @Prop()
  topicName!: string

  @Prop()
  announcementCode?: string

  @Prop()
  moreDetails!: string

  @Prop()
  coverPhoto!: string

  @Prop()
  photo?: string
}

export type AnnounceDocument = Announce & BaseDocument

export const AnnounceSchema = SchemaFactory.createForClass(Announce)

AnnounceSchema.plugin(mongoosePaginate)