import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({
    required: true,
    type: MongooseSchema.Types.String,
    unique: true,
    trim: true,
  })
  plate: string

  @Prop({
    trim: true,
    uppercase: true,
    type: MongooseSchema.Types.String,
  })
  model: string

  @Prop({
    trim: true,
    uppercase: true,
    type: MongooseSchema.Types.String,
  })
  brand: string

  @Prop({ type: MongooseSchema.Types.Number, required: true })
  year: number

  @Prop({
    trim: true,
    default: 150000,
  })
  maxKm: number

  @Prop({ default: false, required: false })
  isShielded?: boolean

  @Prop({
    type: {
      type: MongooseSchema.Types.String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  })
  location?: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }

  @Prop({
    type: MongooseSchema.Types.Date,
    required: false,
  })
  updatedPositionAt?: Date
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle)

VehicleSchema.index({ location: '2dsphere' })
VehicleSchema.index({ plate: 1 }, { unique: true })

export type VehicleDocument = Vehicle & Document
