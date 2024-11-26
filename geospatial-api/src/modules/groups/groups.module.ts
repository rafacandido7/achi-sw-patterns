import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GroupsController } from './groups.controller'
import { GroupsRepository } from './groups.repository'
import { GroupsService } from './groups.service'
import { PermissionsModule, PermissionsService } from '../permissions'
import { Group, GroupSchema } from './schemas/groups.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    PermissionsModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository, PermissionsService],
  exports: [GroupsService, GroupsRepository, PermissionsService],
})
export class GroupsModule {}
