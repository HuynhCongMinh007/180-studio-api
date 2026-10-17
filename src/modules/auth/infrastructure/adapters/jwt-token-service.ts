import { Injectable } from '@nestjs/common'
import { TokenService } from '../../domain/ports/token-service'
import { Token, TokenProp } from '../../domain/value-objects/token.vo'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@/shared/domain/role.enum'

@Injectable()
export class JwtTokenService extends TokenService {
  private readonly _jwt: JwtService

  constructor(jwt: JwtService) {
    super()
    this._jwt = jwt
  }

  async sign(payload: { sub: string; role: Role }): Promise<Token> {
    const accessToken = await this._jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '3d',
    })

    const refreshToken = await this._jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    })
    const token: TokenProp = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    }

    return Token.create(token)
  }
}
