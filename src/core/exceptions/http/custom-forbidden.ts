import { CustomException } from '@core/exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/http';

export class CustomForbidden extends CustomException {
  constructor(error: string, message?: string) {
    super(HttpExceptionStatusCode.FORBIDDEN, error, message);
  }
}
