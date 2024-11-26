import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Roles } from '@modules/permissions/decorators/roles.decorator'
import { RolesGuard } from '@modules/permissions/guards/roles.guard'

import { CreateGroupDto } from './dto/create-group.dto'
import { GroupPermissionsDto } from './dto/group-permissions.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { GroupsService } from './groups.service'
import { GroupsPermission } from '../permissions/enums/groups.enum'

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiCreatedResponse({ description: 'Group successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(RolesGuard)
  @Roles(GroupsPermission.create)
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.create(createGroupDto)
  }

  @UseGuards(RolesGuard)
  @Roles(GroupsPermission.addPermission)
  @Post(':id/permissions/:action')
  @ApiOperation({ summary: 'Add a permission to a group' })
  @ApiCreatedResponse({ description: 'Permission successfully added' })
  @ApiParam({ name: 'id', description: 'The ID of the group' })
  @ApiParam({ name: 'action', description: 'The action to add as permission' })
  @ApiResponse({ status: 404, description: 'Group or permission not found' })
  async addPermission(@Param() params: GroupPermissionsDto) {
    return await this.groupsService.addPermission(params)
  }

  @UseGuards(RolesGuard)
  @Roles(GroupsPermission.update)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiParam({ name: 'id', description: 'The ID of the group to update' })
  @ApiResponse({ status: 200, description: 'Group successfully updated' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('id') id: string,
  ) {
    return await this.groupsService.update(id, updateGroupDto)
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(GroupsPermission.delete)
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({ name: 'id', description: 'The ID of the group to delete' })
  @ApiResponse({ status: 200, description: 'Group successfully deleted' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async remove(@Param('id') id: string) {
    return await this.groupsService.remove(id)
  }

  @UseGuards(RolesGuard)
  @Roles(GroupsPermission.delete)
  @Delete(':id/permissions/:action')
  @ApiOperation({ summary: 'Remove a permission from a group' })
  @ApiParam({ name: 'id', description: 'The ID of the group' })
  @ApiParam({
    name: 'action',
    description: 'The action to remove as permission',
  })
  @ApiResponse({ status: 200, description: 'Permission successfully removed' })
  @ApiResponse({ status: 404, description: 'Group or permission not found' })
  async removePermission(@Param() params: GroupPermissionsDto) {
    return await this.groupsService.removePermission(params)
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(GroupsPermission.findAll)
  @ApiOperation({ summary: 'Retrieve all groups' })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
  findAll() {
    return this.groupsService.getAll()
  }

  @Get(':id')
  @Roles(GroupsPermission.findOne)
  @ApiOperation({ summary: 'Retrieve a group by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the group to retrieve' })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findById(id)
  }
}
