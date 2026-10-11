import { DomainError } from '../../../../shared/domain/domain.error';

export class InvalidProjectImageError extends DomainError {
  readonly code = 'PROJECT_IMAGE_INVALID';
  readonly kind = 'invalid';

  constructor(message: string) {
    super(message);
    this.name = 'InvalidProjectImageError';
  }
}
