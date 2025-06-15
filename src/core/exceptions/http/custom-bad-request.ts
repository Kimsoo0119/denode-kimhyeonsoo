import { CustomException } from '@core/exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/http';

export class CustomBadRequest extends CustomException {
  constructor(error: string, message?: string) {
    super(HttpExceptionStatusCode.BAD_REQUEST, error, message);
  }
}
