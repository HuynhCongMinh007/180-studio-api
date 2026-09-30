import { DomainError } from '../../../../shared/domain/domain.error';

export class InvalidHomeSlideError extends DomainError {
  readonly code = 'HOME_SLIDE_INVALID';
  readonly kind = 'invalid';

  constructor(message: string) {
    super(message);
    this.name = 'InvalidHomeSlideError';
  }
}
