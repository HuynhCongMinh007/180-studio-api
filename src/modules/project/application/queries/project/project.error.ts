import { ApplicationError } from '@/shared/application/application.error'

export class ProjectNotFoundError extends ApplicationError {
  readonly code = 'PROEJCT_NOT_FOUND'
  readonly kind = 'not_found'
  constructor(message: string) {
    super(message)
  }
}
