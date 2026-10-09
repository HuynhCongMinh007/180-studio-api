import { ApplicationError } from '@/shared/application/application.error'

export class InvalidCredentialsError extends ApplicationError {
  readonly code = 'AUTH_INVALID_CREDENTIALS'
  readonly kind = 'unauthorized'

  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}
