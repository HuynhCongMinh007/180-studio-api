import { Account } from '../entities/auth.entity'
export abstract class AccountRepository {
  abstract findByEmail(email: string): Promise<Account | null>
}
