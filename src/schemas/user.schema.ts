import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'
import * as mongoose from 'mongoose'

@Schema({ timestamps: true })
export class User extends Base {
  constructor(user?: User) {
    super()
    Object.assign(this, user)
  }

  static get ModelName() {
    return 'User'
  }

  @Prop({ unique: true })
  email!: string

  @Prop({ default: '' })
  displayEmail?: string

  @Prop({ default: false })
  verified!: boolean

  @Prop({ default: '' })
  firstname!: string

  @Prop({ default: '' })
  lastname!: string

  @Prop({ default: null })
  firstnameEN!: string

  @Prop({ default: null })
  lastnameEN!: string

  @Prop({ default: null })
  avatar!: string

  @Prop({ default: '' })
  descriptions?: string

  @Prop({ default: null })
  tel!: string

  @Prop({ default: null })
  province!: string

  @Prop({ default: null })
  district!: string

  @Prop({ default: null })
  subDistrict!: string

  @Prop({ default: null })
  zipcode!: string

  @Prop({ default: null })
  nationality!: string

  @Prop({ default: null })
  status!: string

  @Prop({ default: [] })
  workCities!: string[]

  @Prop({ default: 0 })
  expectedSalary!: number

  @Prop({ default: null })
  gender!: string

  @Prop({ default: null })
  birthdate!: Date

  @Prop({ default: null })
  imageProfileUrlS?: string

  @Prop({ default: null })
  imageProfileUrlM?: string

  @Prop({ default: null })
  imageProfileUrl?: string
}

export type UserDocument = User & BaseDocument

export const UserSchema = SchemaFactory.createForClass(User)
