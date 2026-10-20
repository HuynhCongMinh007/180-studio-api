import { Injectable } from '@nestjs/common'
import { TransactionManager } from '@/shared/domain/transactions/transaction-manager'
import { runInTransaction } from '@/shared/domain/transactions/transaction-context'
import { PrismaService } from './prisma.service'

@Injectable()
export class PrismaTransactionManager extends TransactionManager {
  constructor(private readonly prisma: PrismaService) {
    super()
  }

  run<R>(callback: () => Promise<R>): Promise<R> {
    return this.prisma.$transaction((tx) => runInTransaction(tx, callback), {
      timeout: 10000,
    })
  }
}
