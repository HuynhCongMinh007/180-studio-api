import { DomainError } from '@/shared/domain/errors/domain.error'

export class InvalidProjectError extends DomainError {
  readonly code = 'PROJECT_INVALID'
  readonly kind = 'invalid'

  constructor(message: string) {
    super(message)
    this.name = 'InvalidProjectError'
  }
}

export class ProjectNotFoundError extends DomainError {
  readonly code = 'PROJECT_NOT_FOUND'
  readonly kind = 'not_found'

  constructor(projectId: string) {
    super(`Project ${projectId} not found`)
    this.name = 'ProjectNotFoundError'
  }
}
