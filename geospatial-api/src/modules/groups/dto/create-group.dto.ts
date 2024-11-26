import { OmitType } from '@nestjs/swagger'
import { GroupDto } from './group.dto'

export class CreateGroupDto extends OmitType(GroupDto, [
  '_id',
  'permissions',
]) {}
