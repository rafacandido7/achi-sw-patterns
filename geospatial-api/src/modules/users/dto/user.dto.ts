import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { BaseDto } from '../../../shared/dto'

export class UserDto extends BaseDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string

  @ApiProperty({ example: 'nice_username' })
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  username: string

  @ApiProperty({ required: false, example: 'Name' })
  @IsOptional()
  @IsString()
  name: string
}
