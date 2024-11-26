import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateGroupDto } from './dto/create-group.dto'
import { GenericRepository } from '@/shared/repositories'
import { Group, GroupDocument } from './schemas/groups.schema'

export class GroupsRepository extends GenericRepository<GroupDocument> {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {
    super(groupModel)
  }

  async create(createGroupDto: CreateGroupDto): Promise<GroupDocument> {
    return super.create(createGroupDto)
  }

  async insertMany(createGroupDto: CreateGroupDto[]): Promise<GroupDocument[]> {
    return super.insertMany(createGroupDto)
  }
}
