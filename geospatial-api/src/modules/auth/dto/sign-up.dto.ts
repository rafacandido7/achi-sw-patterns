import { PickType } from '@nestjs/swagger'

import { UserDto } from '../../users/dto/user.dto'

export class SignUpDto extends PickType(UserDto, [
  'name',
  'email',
  'password',
  'username',
]) {}
