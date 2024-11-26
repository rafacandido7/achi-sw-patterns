import { SetMetadata } from '@nestjs/common'
import { Role } from '../enums/roles'

export const ROLES_KEY = 'roles'

// eslint-disable-next-line prefer-spread
export const roles = [].concat.apply([], Object.values(Role).map(Object.values))

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
