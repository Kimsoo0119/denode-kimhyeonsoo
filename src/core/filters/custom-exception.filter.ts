import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '@core/exceptions/http/custom.exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter<CustomException> {
  private logger = new Logger(CustomExceptionFilter.name);

  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const res = {
      status,
      error: exception.error,
      message: exception.message,
    };

    this.logger.error(res);
    this.logger.error(exception.stack);

    response.status(status).json(res);
  }
}
