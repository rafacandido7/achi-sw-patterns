import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Vehicle, VehicleDocument } from './schemas/vehicle.schema'

import { GenericRepository } from '../../shared/repositories'

export class VehiclesRepository extends GenericRepository<VehicleDocument> {
  constructor(
    @InjectModel(Vehicle.name) private vehiclesModel: Model<VehicleDocument>,
  ) {
    super(vehiclesModel)
  }
}
