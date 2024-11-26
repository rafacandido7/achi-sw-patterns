import { Types } from 'mongoose'

export function isSameMongoId(
  firstId: string | Types.ObjectId,
  secondId: string | Types.ObjectId,
) {
  if (!firstId || !secondId) return false

  return firstId.toString() === secondId.toString()
}
