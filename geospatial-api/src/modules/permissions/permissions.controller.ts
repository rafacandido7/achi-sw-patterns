import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { PermissionsService } from './permissions.service'

import { IsPublic } from '@shared/decorators/is-public.decorator'

@ApiTags('Permission')
@IsPublic()
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findActions() {
    return this.permissionsService.findAll()
  }
}
