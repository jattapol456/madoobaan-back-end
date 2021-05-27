import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base, BaseDocument } from './base.schema';
import * as mongoose from 'mongoose';
import mongoosePaginate = require('mongoose-paginate-v2');

@Schema({ timestamps: true })
export class Announce extends Base {
  constructor(Announce?: Announce) {
    super();
    Object.assign(this, Announce);
  }

  @Prop()
  type!: string;

  @Prop()
  province!: string;

  @Prop()
  district!: string;

  @Prop()
  subdistrict!: string;

  @Prop()
  provinceName!: string;

  @Prop()
  districtName!: string;

  @Prop()
  subDistrictName!: string;

  @Prop()
  zipcode!: number;

  @Prop()
  zipcodeName!: string;

  @Prop()
  houseNumber!: string;

  @Prop()
  moo!: string;

  @Prop()
  soi!: string;

  @Prop()
  road!: string;

  @Prop()
  floor?: string;

  @Prop()
  bedroom!: string;

  @Prop()
  bathroom!: string;

  @Prop()
  parking!: string;

  @Prop()
  direction?: string;

  @Prop()
  furniture?: string;

  @Prop()
  rai!: string;

  @Prop()
  ngan!: string;

  @Prop()
  squareWa!: string;

  @Prop()
  squareMeter!: string;

  @Prop()
  salePrice!: number;

  @Prop()
  rentalCommonfee?: string;

  @Prop()
  roomStatus?: string;

  @Prop()
  agent?: string;

  @Prop()
  commonFee?: string[];

  @Prop()
  security?: string[];

  @Prop()
  facilities?: string[];

  @Prop()
  topicName!: string;

  @Prop()
  moreDetails!: string;

  @Prop()
  coverPhoto!: string;

  @Prop()
  photo?: string[];

  @Prop()
  firstname?: string;

  @Prop()
  lastname?: string;

  @Prop()
  tel?: string;

  @Prop()
  facebook?: string;

  @Prop()
  email?: string;

  @Prop()
  line?: string;
}

export type AnnounceDocument = Announce & BaseDocument;

export const AnnounceSchema = SchemaFactory.createForClass(Announce);

AnnounceSchema.plugin(mongoosePaginate);
