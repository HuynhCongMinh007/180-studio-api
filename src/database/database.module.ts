import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TransactionManager } from '@/shared/domain/transaction/transaction-manager'
import { PrismaTransactionManager } from './prisma-transaction-manager'

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: TransactionManager,
      useClass: PrismaTransactionManager,
    },
  ],
  exports: [PrismaService, TransactionManager],
})
export class DatabaseModule {}
