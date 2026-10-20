import { Role } from '@/shared/domain/role.enum'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { InvalidTokenError, MissingTokenError } from '../errors/access.errors'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

export interface JwtPayload {
  sub: string
  role: Role
}
export interface AuthenticatedRequest extends Request {
  user: JwtPayload
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _jwtService: JwtService
  constructor(jwtService: JwtService) {
    this._jwtService = jwtService
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const bearerToken = request.headers.authorization
    if (!bearerToken) {
      throw new MissingTokenError()
    }

    const arrToken = bearerToken.split(' ')
    if (arrToken[0] !== 'Bearer' || !arrToken[1]) {
      throw new MissingTokenError()
    }

    const token = arrToken[1]
    try {
      const payload = await this._jwtService.verifyAsync<JwtPayload>(token, {
        algorithms: ['HS256'],
        secret: process.env.JWT_ACCESS_SECRET,
      })
      request.user = payload
    } catch {
      throw new InvalidTokenError()
    }

    return true
  }
}
