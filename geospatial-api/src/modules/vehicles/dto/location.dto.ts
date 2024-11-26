import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsNumber } from 'class-validator'

export class LocationDto {
  @ApiProperty({
    example: 'Point',
    description: 'The type of the location',
  })
  @IsNotEmpty()
  @IsIn(['Point'])
  type: 'Point'

  @ApiProperty({
    example: [-74.006, 40.7128],
    description: 'The coordinates of the location [longitude, latitude]',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number]
}
