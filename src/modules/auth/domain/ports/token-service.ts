import { Token } from '../value-objects/token.vo'

export abstract class TokenService {
  abstract sign(payload: { sub: string }): Promise<Token>
}
