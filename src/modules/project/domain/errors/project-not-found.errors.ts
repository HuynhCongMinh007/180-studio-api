import { DomainError } from '@/shared/domain/errors/domain.error'

export class ProjectNotFoundError extends DomainError {
  readonly code = 'NOT_FOUND'
  readonly kind = 'not_found'

  constructor(message: string) {
    super(message)
    this.name = 'ProjectNotFoundError'
  }
}
