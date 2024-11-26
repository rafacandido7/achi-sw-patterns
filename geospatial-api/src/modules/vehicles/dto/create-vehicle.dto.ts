import { PickType } from '@nestjs/swagger'

import { VehicleDto } from './vehicle.dto'

export class CreateVehicleDto extends PickType(VehicleDto, [
  'plate',
  'model',
  'brand',
  'year',
  'maxKm',
  'location',
  'updatedPositionAt',
]) { }
