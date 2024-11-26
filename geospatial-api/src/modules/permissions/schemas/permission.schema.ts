import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true, type: MongooseSchema.Types.String })
  name: string

  @Prop({ required: false, type: MongooseSchema.Types.String })
  description: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)

PermissionSchema.index({ name: 1 }, { unique: true })

export type PermissionDocument = Permission & Document
