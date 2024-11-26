import { Injectable } from '@nestjs/common'

import { Role } from './enums/roles'
import { roles } from './decorators/roles.decorator'

@Injectable()
export class PermissionsService {
  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.findSubjects().map((r: any) => {
      r = { subject: r }
      r.permissions = Object.keys(Role[r.subject]).map((a: string) => {
        return { name: a, action: `${r.subject}.${a}` }
      })
      return r
    })
  }

  findSubjects(): string[] {
    return Object.keys(Role)
  }

  findActions(): string[] {
    return roles
  }
}
