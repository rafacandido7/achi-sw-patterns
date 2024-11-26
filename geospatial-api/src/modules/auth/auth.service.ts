import { compare, hash } from 'bcryptjs'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from './../users/users.service'

import { SignInDto, SignUpDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(authenticateDto: SignInDto) {
    const { login, password } = authenticateDto

    const user = await this.usersService.findOneByCredentials(login)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials!')
    }

    const isPasswordMatched = await compare(password, user.password)

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials!')
    }

    const accessToken = await this.generateAccessToken(user.id)

    if (!accessToken) {
      throw new Error()
    }

    return { accessToken }
  }

  async signUp(signUpDto: SignUpDto) {
    await this.usersService.validateCretendials(signUpDto)

    const hashedPassword = await hash(signUpDto.password, 12)

    const newUser = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    })

    if (!newUser && newUser._id) {
      throw new Error('User not created!')
    }

    const accessToken = await this.generateAccessToken(newUser._id as string)

    return { accessToken }
  }

  private async generateAccessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId })
  }
}
