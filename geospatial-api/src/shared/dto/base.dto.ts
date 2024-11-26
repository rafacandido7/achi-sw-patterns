import { IsDate, IsMongoId, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class BaseDto {
  @ApiProperty({ example: new Types.ObjectId() })
  @IsNotEmpty()
  @IsMongoId()
  _id: Types.ObjectId

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date

  @ApiProperty({
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date
}
