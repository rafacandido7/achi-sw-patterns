import { SetMetadata } from '@nestjs/common'

export const IsPublicKey = 'IsPublic'

export function IsPublic() {
  return SetMetadata(IsPublicKey, true)
}
