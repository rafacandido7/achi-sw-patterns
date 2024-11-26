import { Request } from 'express'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import { IsPublicKey } from '@/shared/decorators'
import { UsersService } from '../users'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublicKey, [
      context.getClass(),
      context.getHandler(),
    ])

    if (!isPublic) {
      const request = context.switchToHttp().getRequest()
      const token = this.extractTokenFromHeader(request)

      if (!token) {
        throw new UnauthorizedException()
      }

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        })

        request.userId = payload.sub
        request.user = await this.usersService.me(payload.sub)
      } catch {
        throw new UnauthorizedException()
      }

      return true
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
