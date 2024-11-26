import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Types } from 'mongoose'

import { Vehicle } from './schemas/vehicle.schema'
import { CreateVehicleDto } from './dto'
import { VehiclesRepository } from './vehicles.repository'
import { CacheService } from '../cache/cache.service'
import { CACHE_TTL } from '../cache/enums/cache-ttl'

@Injectable()
export class VehiclesService {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly cacheService: CacheService,
  ) { }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehiclesRepository.findOne({
      plate: createVehicleDto.plate,
    })

    if (existingVehicle) {
      throw new ConflictException('A vehicle with this plate already exists.')
    }

    const vehicle = await this.vehiclesRepository.create(createVehicleDto)

    if (!vehicle) {
      throw new Error('Error on creating vehicle!')
    }

    await this.cacheService.del('vehicles:all')

    return vehicle
  }

  async findOneByPlate(plate: string): Promise<Vehicle> {
    const cacheKey = `vehicle:plate:${plate}`
    const cachedVehicle = await this.cacheService.get<Vehicle>(cacheKey)

    if (cachedVehicle) {
      return cachedVehicle
    }

    const vehicle = await this.vehiclesRepository.findOne({ plate })

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.')
    }

    await this.cacheService.set(cacheKey, vehicle, CACHE_TTL.FIVE_MINUTES)

    return vehicle
  }

  async findOne(id: string | Types.ObjectId): Promise<Vehicle> {
    const cacheKey = `vehicle:id:${id}`
    const cachedVehicle = await this.cacheService.get<Vehicle>(cacheKey)

    if (cachedVehicle) {
      return cachedVehicle
    }

    const vehicle = await this.vehiclesRepository.findById(id)

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.')
    }

    await this.cacheService.set(cacheKey, vehicle, CACHE_TTL.FIVE_MINUTES)

    return vehicle
  }

  async delete(id: string | Types.ObjectId): Promise<void> {
    const result = await this.vehiclesRepository.delete(id)

    if (!result) {
      throw new NotFoundException('Vehicle not found.')
    }

    await Promise.all([
      this.cacheService.del(`vehicle:id:${id}`),
      this.cacheService.del('vehicles:all'),
    ])
  }

  async getAll(): Promise<Vehicle[]> {
    const cacheKey = 'vehicles:all'
    const cachedVehicles = await this.cacheService.get<Vehicle[]>(cacheKey)

    if (cachedVehicles) {
      return cachedVehicles
    }

    const vehicles = await this.vehiclesRepository.aggregate([
      {
        $project: {
          __v: 0,
        },
      },
    ])

    await this.cacheService.set(cacheKey, vehicles, CACHE_TTL.TEN_MINUTES)

    return vehicles
  }
}
