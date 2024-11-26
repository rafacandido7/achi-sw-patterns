import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'create-user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Create a new user',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string
}
