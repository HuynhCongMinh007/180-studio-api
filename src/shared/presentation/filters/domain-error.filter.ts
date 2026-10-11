import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import {
  DomainError,
  DomainErrorKind,
} from '../../domain/domain.error';

const STATUS_BY_KIND: Record<DomainErrorKind, number> = {
  invalid: 400,
  not_found: 404,
  conflict: 409,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter<DomainError> {
  catch(error: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(STATUS_BY_KIND[error.kind]).json({
      code: error.code,
      message: error.message,
    });
  }
}
