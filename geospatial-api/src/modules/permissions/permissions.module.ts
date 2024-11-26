import { Module } from '@nestjs/common'

import { PermissionController } from './permissions.controller'
import { PermissionsService } from './permissions.service'

@Module({
  controllers: [PermissionController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
