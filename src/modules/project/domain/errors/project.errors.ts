import { DomainError } from '../../../../shared/domain/domain.error'

export class InvalidProjectError extends DomainError {
  readonly code = 'PROJECT_INVALID'
  readonly kind = 'invalid'

  constructor(message: string) {
    super(message)
    this.name = 'InvalidProjectError'
  }
}
