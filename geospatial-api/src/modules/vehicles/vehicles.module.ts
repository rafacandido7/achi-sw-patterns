import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { VehiclesService } from './vehicles.service'
import { VehiclesController } from './vehicles.controller'
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema'
import { CacheService } from '../cache/cache.service'
import { VehiclesRepository } from './vehicles.repository'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService, CacheService, VehiclesRepository],
})
export class VehiclesModule { }
