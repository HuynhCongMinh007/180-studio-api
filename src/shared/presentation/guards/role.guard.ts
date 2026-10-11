import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthenticatedRequest } from './auth.guard'
import { Role } from '@/shared/domain/role.enum'
import { Reflector } from '@nestjs/core'
import { ROLE_KEY, Roles } from '../decorators/role.decorator'
import { removeAllListeners } from 'process'

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
      return false
    }

    return requiredRoles.includes(role)
  }
}
