import { Role } from '@/shared/domain/role.enum'
import { Token } from '../value-objects/token.vo'
export abstract class TokenService {
  abstract sign(payload: { sub: string; role: Role }): Promise<Token>
}
