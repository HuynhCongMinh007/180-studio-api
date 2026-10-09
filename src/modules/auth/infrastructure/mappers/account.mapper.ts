import { User } from '@/generated/prisma/client'
import { Account, AccountProp } from '../../domain/entities/auth.entity'

export function toAccount(record: User): Account {
  const prop: AccountProp = {
    id: record.id,
    email: record.email,
    passwordHash: record.passwordHash,
  }
  const account = Account.create(prop)
  return account
}
