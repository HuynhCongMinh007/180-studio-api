import { Account } from '../entities/auth.entity'
import { Token } from '../value-objects/token.vo'

export abstract class AuthRepository {
  abstract Login(account: Account): Token
}
