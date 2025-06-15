import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthException } from '@core/exceptions/constants';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    // JWT 에러 메시지 분석
    const exceptionMessage = exception.message || '';
    let error: string;
    let message: string;

    if (
      exceptionMessage.includes('No auth token') ||
      exceptionMessage.includes('Unauthorized')
    ) {
      error = AuthException.NO_AUTH_TOKEN.code;
      message = AuthException.NO_AUTH_TOKEN.message;
    } else if (
      exceptionMessage.includes('invalid signature') ||
      exceptionMessage.includes('invalid token') ||
      exceptionMessage.includes('malformed')
    ) {
      error = AuthException.INVALID_TOKEN.code;
      message = AuthException.INVALID_TOKEN.message;
    } else if (exceptionMessage.includes('jwt expired')) {
      error = AuthException.JWT_EXPIRED.code;
      message = AuthException.JWT_EXPIRED.message;
    } else {
      error = AuthException.UNAUTHORIZED.code;
      message = AuthException.UNAUTHORIZED.message;
    }

    const errorResponse = {
      statusCode,
      error: error,
      message: message,
    };

    this.logger.error(
      `JWT Authentication Failed: ${exceptionMessage}`,
      `Path: ${request.url}`,
      exception.stack,
    );

    response.status(statusCode).json(errorResponse);
  }
}
