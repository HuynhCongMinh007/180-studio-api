import { Role } from '@/shared/domain/role.enum'
import { CustomDecorator, SetMetadata } from '@nestjs/common'

export const ROLE_KEY = 'role'

export function Roles(...roles: Role[]): CustomDecorator<string> {
  const roleDecor = SetMetadata(ROLE_KEY, roles)
  return roleDecor
}
