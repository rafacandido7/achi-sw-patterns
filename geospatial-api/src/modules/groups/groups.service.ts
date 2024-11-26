import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PermissionsService } from '@modules/permissions/permissions.service'

import { CreateGroupDto } from './dto/create-group.dto'
import { GroupPermissionsDto } from './dto/group-permissions.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { GroupsRepository } from './groups.repository'
import { isSameMongoId } from '@/shared/utils/is-same-mongo-id'
import { GroupDocument } from './schemas/groups.schema'

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = await this.findByName(createGroupDto.name)

    if (group) {
      throw new BadRequestException('Already exists a group with this name.')
    }

    return this.groupsRepository.create({
      ...createGroupDto,
    })
  }

  getAll() {
    return this.groupsRepository.findAll()
  }

  findByName(name: string): Promise<GroupDocument | null> {
    return this.groupsRepository.findOne({ name })
  }

  async findById(id: string) {
    const group = await this.groupsRepository.findById(id)
    return this.mapPermissions(group)
  }

  async findByObjectId(id: string) {
    return this.groupsRepository.findById(id)
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const groupWithSameName = await this.findByName(updateGroupDto.name)
    const groupWithSameNameId = groupWithSameName._id.toString()

    if (!groupWithSameName && groupWithSameNameId) {
      throw new NotFoundException('Group not found')
    }

    if (groupWithSameName && !isSameMongoId(id, groupWithSameNameId)) {
      throw new BadRequestException('Already exists a group with this name.')
    }

    updateGroupDto.permissions.forEach((action) => {
      if (!this.permissionsService.findActions().includes(action)) {
        throw new Error(`Permission ${action} is not valid`)
      }
    })

    return this.groupsRepository.findByIdAndUpdate(id, updateGroupDto)
  }

  async remove(id: string) {
    const group = await this.groupsRepository.findById(id)

    if (!group) {
      throw new NotFoundException('Group not found')
    }

    return await this.groupsRepository.delete(id)
  }

  async addPermission(data: GroupPermissionsDto) {
    if (!this.permissionsService.findActions().includes(data.action)) {
      throw new NotFoundException("Action doesn't exists")
    }
    const group = await this.groupsRepository.findById(data.id)
    if (!group.permissions.includes(data.action)) {
      group.permissions = [...group.permissions, data.action]
    }
    await group.save()

    return group
  }

  async removePermission(data: GroupPermissionsDto) {
    const group = await this.groupsRepository.findById(data.id)
    group.permissions = group.permissions.filter((p) => p !== data.action)
    await group.save()

    return group
  }

  mapPermissions(group: GroupDocument) {
    const permissions = this.permissionsService
      .findSubjects()
      .map((subject) => {
        const actions = group.permissions
          .filter((a) => a.includes(subject + '.'))
          .map((a) => a.split('.')[1])
        return { subject, actions }
      })
      .filter((p) => p.actions.length > 0)
    return { name: group.name, permissions }
  }
}
