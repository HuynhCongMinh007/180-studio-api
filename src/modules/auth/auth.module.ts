import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { LoginUseCase } from './application/use-cases/login.use-case'
import { PasswordHasher } from './domain/ports/password-hasher'
import { TokenService } from './domain/ports/token-service'
import { AccountRepository } from './domain/repositories/auth.repository'
import { BcryptPasswordHasher } from './infrastructure/adapters/bcrypt-password-hasher'
import { JwtTokenService } from './infrastructure/adapters/jwt-token-service'
import { PrismaAccountRepository } from './infrastructure/repositories/prisma-account.repository'
import { PublicLoginController } from './presentation/controllers/public-login.controller'

@Module({
  imports: [JwtModule.register({})],
  controllers: [PublicLoginController],
  providers: [
    LoginUseCase,
    // Bind each domain port to its adapter.
    { provide: AccountRepository, useClass: PrismaAccountRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenService, useClass: JwtTokenService },
  ],
})
export class AuthModule {}
