import { IsNotEmpty, IsMongoId, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GroupPermissionsDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'users.create', required: true })
  action: string
}
