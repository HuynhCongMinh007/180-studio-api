import { HttpStatus } from '@nestjs/common';
import type { DomainErrorKind } from '../../domain/domain.error';

export const ERROR_MESSAGE = {
  INTERNAL: 'Internal server error',
  VALIDATION: 'Validation failed',
} as const;

export const ERROR_CODE = {
  INTERNAL: 'INTERNAL_ERROR',
  HTTP_FALLBACK: 'HTTP_ERROR',
} as const;

export const STATUS_BY_KIND: Record<DomainErrorKind, HttpStatus> = {
  invalid: HttpStatus.BAD_REQUEST,
  not_found: HttpStatus.NOT_FOUND,
  conflict: HttpStatus.CONFLICT,
};

export const VALIDATION_DETAILS_SEPARATOR = '; ';
