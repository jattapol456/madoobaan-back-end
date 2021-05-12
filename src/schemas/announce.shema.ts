import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Announce {
  @Prop({ default: null })
  latitude!: number;

  @Prop({ default: null })
  longitude!: number;

  @Prop({ default: null })
  homeNumber!: number;

  @Prop({ default: null })
  moo!: number;

  @Prop({ default: null })
  subDistrict!: string;

  @Prop({ default: null })
  district!: string;

  @Prop({ default: null })
  province!: string;

  @Prop({ default: null })
  zipCode!: string;

  @Prop({ default: null })
  description!: string;

  @Prop({ default: null })
  sold?: string;
}

export const AnnounceSchema = SchemaFactory.createForClass(Announce);
