import { CustomException } from '@core/exceptions/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/enums/http-exception-enum';

export class CustomInternalServerError extends CustomException {
  constructor(errorCode: string) {
    super(HttpExceptionStatusCode.INTERNAL_SERVER_ERROR, errorCode);
  }
}
