import { CustomException } from '@core/exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/http';

export class CustomUnauthorized extends CustomException {
  constructor(error: string, message?: string) {
    super(HttpExceptionStatusCode.UNAUTHORIZED, error, message);
  }
}
