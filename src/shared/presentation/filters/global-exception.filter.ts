import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainError, DomainErrorKind } from '../../domain/domain.error';
import { ErrorResponseDto } from '../dtos/error-response.dto';
import { getRequestId } from '../request-context/request-context';

const STATUS_BY_KIND: Record<DomainErrorKind, number> = {
  invalid: 400,
  not_found: 404,
  conflict: 409,
};

interface ResolvedError {
  status: number;
  message: string;
  messageCode: string;
  details: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const resolved = this.resolve(exception);
    this.log(exception, resolved.status, req);

    const body: ErrorResponseDto = {
      success: false,
      message: resolved.message,
      messageCode: resolved.messageCode,
      error: { details: resolved.details },
      path: req.originalUrl,
      requestId: getRequestId() ?? '',
      timestamp: new Date().toISOString(),
    };
    res.status(resolved.status).json(body);
  }

  private resolve(exception: unknown): ResolvedError {
    if (exception instanceof DomainError) {
      return {
        status: STATUS_BY_KIND[exception.kind],
        message: exception.message,
        messageCode: exception.code,
        details: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const { message, details } = this.readHttpBody(exception);
      return {
        status,
        message,
        messageCode: HttpStatus[status] ?? 'HTTP_ERROR',
        details,
      };
    }
    
    const reason =
      exception instanceof Error ? exception.message : 'Unknown error';
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      messageCode: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : reason,
    };
  }

  private readHttpBody(exception: HttpException): {
    message: string;
    details: string;
  } {
    const body = exception.getResponse();
    if (typeof body === 'string') return { message: body, details: body };

    const raw = (body as { message?: string | string[] }).message;
    if (Array.isArray(raw)) {
      return { message: 'Validation failed', details: raw.join('; ') };
    }
    const message = raw ?? exception.message;
    return { message, details: message };
  }

  private log(exception: unknown, status: number, req: Request): void {
    const reason =
      exception instanceof Error ? exception.message : String(exception);
    const line = `${req.method} ${req.originalUrl} -> ${status} ${reason}`;

    if (status >= 500) {
      this.logger.error(line, exception instanceof Error ? exception.stack : undefined);
    } else {
      this.logger.warn(line);
    }
  }
}
