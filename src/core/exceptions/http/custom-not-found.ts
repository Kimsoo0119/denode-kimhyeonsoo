import { CustomException } from '@core/exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/http';

export class CustomNotFound extends CustomException {
  constructor(error: string, message?: string) {
    super(HttpExceptionStatusCode.NOT_FOUND, error, message);
  }
}
