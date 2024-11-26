import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ default: [] })
  permissions: string[]
}

export type GroupDocument = Group & Document

export const GroupSchema = SchemaFactory.createForClass(Group)

GroupSchema.index({ name: 1 }, { unique: true })
