import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Account } from '../../domain/entities/auth.entity'
import { AccountRepository } from '../../domain/repositories/auth.repository'
import { toAccount } from '../mappers/account.mapper'

@Injectable()
export class PrismaAccountRepository extends AccountRepository {
  private readonly _prisma: PrismaService

  constructor(prisma: PrismaService) {
    super()
    this._prisma = prisma
  }
  async findByEmail(email: string): Promise<Account | null> {
    const record = await this._prisma.user.findUnique({
      where: { email },
    })
    if (!record) return null

    const account = toAccount(record)

    return account
  }
}
