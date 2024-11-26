import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest()

    const { user } = request

    request.role = requiredRoles[0]

    return requiredRoles.some((role) => {
      const [module] = role.split('.')

      const hasRole =
        user.group?.permissions?.includes(role) ||
        user.group?.permissions?.includes(`${module}.all`)

      if (hasRole) return true
      else
        throw new ForbiddenException(
          `Você não tem permissão suficiente para acessar o módulo '${module}'. Por favor, contate o suporte do sistema para verificar seu acesso.`,
          `403 Forbidden: ${role}`,
        )
    })
  }
}
