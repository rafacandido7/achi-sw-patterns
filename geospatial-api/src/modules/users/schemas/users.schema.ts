import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: MongooseSchema.Types.String, unique: true })
  email: string

  @Prop({ required: true, type: MongooseSchema.Types.String })
  password: string

  @Prop({ required: true, type: MongooseSchema.Types.String, unique: true })
  username: string

  @Prop({ required: false, type: MongooseSchema.Types.String })
  name: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: false })
  group?: Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ group: 1 }, { unique: true })

export type UserDocument = User & Document
