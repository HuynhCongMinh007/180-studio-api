import { Injectable } from '@nestjs/common'
import { PasswordHasher } from '../../domain/ports/password-hasher'
import { compare } from 'bcryptjs'

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
