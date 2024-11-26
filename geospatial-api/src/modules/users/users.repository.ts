import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, UserDocument } from './schemas/users.schema'

import { GenericRepository } from '../../shared/repositories'

export class UsersRepository extends GenericRepository<UserDocument> {
  constructor(@InjectModel(User.name) private usersModel: Model<UserDocument>) {
    super(usersModel)
  }
}
