import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'

import { VehiclesService } from './vehicles.service'
import { Roles } from '../permissions/decorators/roles.decorator'
import { VehiclesPermission } from '../permissions/enums'
import { RolesGuard } from '../permissions/guards/roles.guard'
import { CreateVehicleDto, UpdateVehicleDto } from './dto'

@ApiTags('Vehicles')
@Controller('vehicles')
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @UseGuards(RolesGuard)
  @Roles(VehiclesPermission.create)
  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return await this.vehiclesService.create(createVehicleDto)
  }

  @UseGuards(RolesGuard)
  @Roles(VehiclesPermission.findAll)
  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Vehicles retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll() {
    return await this.vehiclesService.getAll()
  }

  @UseGuards(RolesGuard)
  @Roles(VehiclesPermission.find)
  @Get(':vehicleId')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiParam({ name: 'vehicleId', description: 'The ID of the vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findOne(@Param('vehicleId') vehicleId: string) {
    return await this.vehiclesService.findOne(vehicleId)
  }

  @UseGuards(RolesGuard)
  @Roles(VehiclesPermission.delete)
  @Delete(':vehicleId')
  @ApiOperation({ summary: 'Delete vehicle by ID' })
  @ApiParam({ name: 'vehicleId', description: 'The ID of the vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async remove(@Param('vehicleId') vehicleId: string) {
    return await this.vehiclesService.delete(vehicleId)
  }
}
