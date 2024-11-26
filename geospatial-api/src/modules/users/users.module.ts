import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { User, UserSchema } from './schemas/users.schema'
import { GroupsModule } from '../groups'
import { UsersController } from './users.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    GroupsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
