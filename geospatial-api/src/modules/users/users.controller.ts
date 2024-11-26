import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UsersService } from './users.service'
import { UserId } from '@/shared/decorators/user-is.decorator'
import { Roles } from '../permissions/decorators/roles.decorator'
import { UsersPermission } from '../permissions/enums'
import { RolesGuard } from '../permissions/guards/roles.guard'

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(RolesGuard)
  @Roles(UsersPermission.addGroup)
  @Patch(':userId/groups/:groupId')
  @ApiOperation({ summary: 'Add a group to a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiResponse({
    status: 200,
    description: 'Group successfully added to the user',
  })
  @ApiResponse({ status: 404, description: 'User or group not found' })
  async addGroupToUser(
    @Param('userId') userId: string,
    @Param('groupId') groupId: string,
  ) {
    return await this.usersService.addGroupToUser(userId, groupId)
  }

  @UseGuards(RolesGuard)
  @Roles(UsersPermission.find)
  @Get('/me')
  @ApiOperation({ summary: 'Get current authenticated user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@UserId() userId: string) {
    return await this.usersService.me(userId)
  }

  @UseGuards(RolesGuard)
  @Roles(UsersPermission.findAll)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll() {
    return await this.usersService.getAll()
  }
}
