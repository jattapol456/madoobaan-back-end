import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'

@Schema({ timestamps: true })
export class Company extends Base {
  @Prop({ default: '' })
  profileUrl!: string

  @Prop({ default: '' })
  nameTH!: string

  @Prop({ default: '' })
  nameEN!: string

  @Prop({ default: '' })
  businessType!: string

  @Prop({ default: '' })
  numberOfEmployee!: string

  @Prop({ default: '' })
  about!: string

  @Prop({ default: '' })
  welfare!: string

  @Prop({ default: '' })
  address!: string

  @Prop({ default: '' })
  explainPathTH!: string

  @Prop({ default: '' })
  explainPathEN!: string

  @Prop({ default: '' })
  latitude!: string

  @Prop({ default: '' })
  longitude!: string

  @Prop({ default: [] })
  imgUrls!: string[]

  @Prop({ default: null })
  imageProfileUrlS?: string

  @Prop({ default: null })
  imageProfileUrlM?: string

  @Prop({ default: null })
  imageProfileUrl?: string
}

export type CompanyDocument = Company & BaseDocument

export const CompanySchema = SchemaFactory.createForClass(Company)
