import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    example: 'nice_username',
    description: 'User login, could be a username or email',
  })
  @IsString()
  @IsNotEmpty()
  login: string

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string
}
