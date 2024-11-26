import { BaseDto } from '@/shared/dto'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LocationDto } from './location.dto'

export class VehicleDto extends BaseDto {
  @ApiProperty({
    example: 'ABC-1234',
    description: 'License plate of the vehicle',
  })
  @IsNotEmpty()
  @IsString()
  plate: string

  @ApiProperty({
    example: 'Model X',
    description: 'Model of the vehicle',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string

  @ApiProperty({
    example: 'Tesla',
    description: 'Brand of the vehicle',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string

  @ApiProperty({
    example: 2022,
    description: 'Year of the vehicle',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1886)
  @Max(new Date().getFullYear() + 1)
  year: number

  @ApiProperty({
    example: 150000,
    description: 'Maximum kilometers allowed for the vehicle',
    required: false,
    default: 150000,
  })
  @IsOptional()
  @IsNumber()
  maxKm?: number

  @ApiProperty({
    example: false,
    description: 'Whether the vehicle is shielded',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isShielded?: boolean

  @ApiProperty({
    type: LocationDto,
    description: 'Location of the vehicle in GeoJSON format',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto

  @ApiProperty({
    example: new Date('2024-11-25T12:00:00Z'),
    description: 'The date and time when the position was last updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  updatedPositionAt?: Date
}
