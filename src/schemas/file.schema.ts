import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Base, BaseDocument } from './base.schema'

@Schema({ timestamps: true })
export class File extends Base {
  @Prop({ default: null })
  type!: string

  @Prop({ default: null })
  name?: string

  @Prop({ default: null })
  referenceId!: number

  @Prop({ default: null })
  urlS?: string

  @Prop({ default: null })
  urlM?: string

  @Prop({ default: null })
  url!: string
}

export type FileDocument = File & BaseDocument

export const FileSchema = SchemaFactory.createForClass(File)
