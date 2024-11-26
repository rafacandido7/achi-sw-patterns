import { IsNotEmpty, IsMongoId, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GroupDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  _id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Administrators', required: true })
  name: string

  @IsOptional()
  @ApiProperty({ example: ['user.create', 'groups.create'], required: false })
  permissions: string[]
}
