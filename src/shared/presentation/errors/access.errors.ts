import { PresentationError } from './presentation.error'

export class MissingTokenError extends PresentationError {
  readonly code = 'AUTH_MISSING_TOKEN'
  readonly kind = 'unauthorized'

  constructor() {
    super('Missing or malformed bearer token')
    this.name = 'MissingTokenError'
  }
}

export class InvalidTokenError extends PresentationError {
  readonly code = 'AUTH_INVALID_TOKEN'
  readonly kind = 'unauthorized'

  constructor() {
    super('Invalid or expired token')
    this.name = 'InvalidTokenError'
  }
}

export class InsufficientRoleError extends PresentationError {
  readonly code = 'AUTH_INSUFFICIENT_ROLE'
  readonly kind = 'forbidden'

  constructor() {
    super('You do not have permission to perform this action')
    this.name = 'InsufficientRoleError'
  }
}
