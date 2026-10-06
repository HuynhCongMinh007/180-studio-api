import type { Prisma } from '@/generated/prisma/client'

export function decimalToNumber(value: Prisma.Decimal | null): number | null {
  if (value === null) {
    return null
  }
  return value.toNumber()
}
