import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'
import { IsPublic } from '../../shared/decorators/is-public.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('signIn')
  @ApiOperation({ summary: 'Sign in a user' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @IsPublic()
  @Post('signUp')
  @ApiOperation({ summary: 'Sign up a new user' })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }
}
