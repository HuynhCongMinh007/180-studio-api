import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import {
  InsufficientRoleError,
  MissingTokenError,
} from '../errors/access.errors'
import { AuthenticatedRequest } from './auth.guard'
import { Role } from '@/shared/domain/role.enum'
import { Reflector } from '@nestjs/core'
import { ROLE_KEY } from '../decorators/role.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly _reflector: Reflector
  constructor(reflector: Reflector) {
    this._reflector = reflector
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this._reflector.getAllAndOverride<Role[] | undefined>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const role = request.user?.role
    if (!role) {
      throw new MissingTokenError()
    }
    if (!requiredRoles.includes(role)) {
      throw new InsufficientRoleError()
    }

    return true
  }
}
