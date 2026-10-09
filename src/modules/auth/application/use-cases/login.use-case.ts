import { Injectable } from '@nestjs/common'
import { AccountRepository } from '../../domain/repositories/auth.repository'
import { PasswordHasher } from '../../domain/ports/password-hasher'
import { TokenService } from '../../domain/ports/token-service'
import { Token } from '../../domain/value-objects/token.vo'
import { InvalidCredentialsError } from '../errors/auth.errors'

export interface PayloadLogin {
  email: string
  password: string
}
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(payload: PayloadLogin): Promise<Token> {
    const account = await this.accountRepository.findByEmail(payload.email)
    if (!account) throw new InvalidCredentialsError()

    const passwordPlain = payload.password
    const passwordHash = account.passwordHash
    const isPasswordValid = await this.passwordHasher.compare(
      passwordPlain,
      passwordHash,
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    const token: Token = await this.tokenService.sign({ sub: account.id })
    return token
  }
}
