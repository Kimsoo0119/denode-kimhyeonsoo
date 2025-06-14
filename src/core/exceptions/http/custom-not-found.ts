import { CustomException } from '@core/exceptions/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/enums/http-exception-enum';

export class CustomNotFound extends CustomException {
  constructor(errorCode: string) {
    super(HttpExceptionStatusCode.NOT_FOUND, errorCode);
  }
}
