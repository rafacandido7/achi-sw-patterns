import { Types } from 'mongoose'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { UsersRepository } from './users.repository'
import { User } from './schemas/users.schema'

import { CreateUserDto } from './dto'

import { Projection } from '@/shared/types'
import { GroupsService } from '../groups'

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly groupsService: GroupsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCretendials(createUserDto)

    const user = await this.usersRepository.create(createUserDto)

    if (!user) {
      throw new Error('Error on create user!')
    }

    return user
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email })

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    return user
  }

  async validateCretendials(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto

    const [emailExists, usernameExists] = await Promise.all([
      this.usersRepository.findOne({ email }),
      this.usersRepository.findOne({ username }),
    ])

    if (emailExists) {
      throw new ConflictException('This Email already in use.')
    }

    if (usernameExists) {
      throw new ConflictException('This Username already in use.')
    }
  }

  async findOne(
    id: string | Types.ObjectId,
    projection: Projection<User>,
  ): Promise<User> {
    const user = await this.usersRepository.findById(id, projection)

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    return user
  }

  async findOneByCredentials(login: string) {
    return this.usersRepository.findOne({
      $or: [{ email: login }, { username: login }],
    })
  }

  async addGroupToUser(userId: string, groupId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const group = await this.groupsService.findByObjectId(groupId)
    if (!group || !group._id) {
      throw new NotFoundException('Group not found')
    }

    const groupObjectId = new Types.ObjectId(group._id.toString())

    await this.usersRepository.update(user._id.toString(), {
      group: groupObjectId,
    })

    return await this.usersRepository.findById(userId, {}, 'group')
  }

  async me(userId: string) {
    return await this.usersRepository.findById(userId, {}, 'group')
  }

  async getAll() {
    return this.usersRepository.aggregate([
      {
        $project: {
          password: 0,
        },
      },
    ])
  }
}
