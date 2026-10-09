import { Token } from '../../domain/value-objects/token.vo'
import { LoginResponseDto } from '../dtos/login.responsity.dto'

export function toTokenDto(token: Token): LoginResponseDto {
  const loginResponse: LoginResponseDto = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  }
  return loginResponse
}
