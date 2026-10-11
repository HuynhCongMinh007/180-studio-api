import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { ApplicationError } from '../../application/application.error'
import { DomainError } from '../../domain/domain.error'
import {
  ERROR_CODE,
  ERROR_MESSAGE,
  STATUS_BY_KIND,
  VALIDATION_DETAILS_SEPARATOR,
} from '../constants/error.constants'
import { ErrorResponseDto } from '../dtos/error-response.dto'
import { getRequestId } from '../request-context/request-context'

interface ResolvedError {
  status: number
  message: string
  messageCode: string
  details: string
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp()
    const req = http.getRequest<Request>()
    const res = http.getResponse<Response>()

    const resolved = this.resolve(exception)
    this.log(exception, resolved.status, req)

    const body: ErrorResponseDto = {
      success: false,
      message: resolved.message,
      messageCode: resolved.messageCode,
      error: { details: resolved.details },
      path: req.originalUrl,
      requestId: getRequestId() ?? '',
      timestamp: new Date().toISOString(),
    }
    res.status(resolved.status).json(body)
  }

  private resolve(exception: unknown): ResolvedError {
    if (exception instanceof DomainError) {
      return {
        status: STATUS_BY_KIND[exception.kind],
        message: exception.message,
        messageCode: exception.code,
        details: exception.message,
      }
    }

    if (exception instanceof ApplicationError) {
      return {
        status: STATUS_BY_KIND[exception.kind],
        message: exception.message,
        messageCode: exception.code,
        details: exception.message,
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const messageCode = HttpStatus[status] ?? ERROR_CODE.HTTP_FALLBACK

      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status,
          message: ERROR_MESSAGE.INTERNAL,
          messageCode,
          details: ERROR_MESSAGE.INTERNAL,
        }
      }
      const { message, details } = this.readHttpBody(exception)
      return { status, message, messageCode, details }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGE.INTERNAL,
      messageCode: ERROR_CODE.INTERNAL,
      details: ERROR_MESSAGE.INTERNAL,
    }
  }

  private readHttpBody(exception: HttpException): {
    message: string
    details: string
  } {
    const body = exception.getResponse()
    if (typeof body === 'string') return { message: body, details: body }

    const raw = (body as { message?: string | string[] }).message
    if (Array.isArray(raw)) {
      return {
        message: ERROR_MESSAGE.VALIDATION,
        details: raw.join(VALIDATION_DETAILS_SEPARATOR),
      }
    }
    const message = raw ?? exception.message
    return { message, details: message }
  }

  private log(exception: unknown, status: number, req: Request): void {
    const line = `${req.method} ${req.originalUrl} -> ${status}`
    const reason =
      exception instanceof Error ? exception.message : String(exception)

    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(`${line} ${reason}`)
      return
    }

    // A stack already starts with "Name: message", so don't repeat the message in `line`.
    if (exception instanceof Error && exception.stack) {
      this.logger.error(line, exception.stack)
    } else {
      this.logger.error(`${line} ${reason}`)
    }
  }
}
