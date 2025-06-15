import { HttpException } from '@nestjs/common';
import { HttpExceptionStatusCode } from '@core/exceptions/http';
export class CustomException extends HttpException {
  constructor(
    statusCode: HttpExceptionStatusCode,
    error: string,
    message?: string,
  ) {
    super(message || error, statusCode);
    this.error = error;
    this.statusCode = statusCode;
    this.message = message || error;
  }

  error: string;
  statusCode: number;
  message: string;
}
