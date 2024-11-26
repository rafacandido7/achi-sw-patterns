import { PartialType } from '@nestjs/swagger'
import { GroupDto } from './group.dto'

export class UpdateGroupDto extends PartialType(GroupDto) {}
