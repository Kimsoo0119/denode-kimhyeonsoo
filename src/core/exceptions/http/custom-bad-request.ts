import { CustomException } from '@core/exceptions/custom.exception';
import { HttpExceptionStatusCode } from '@core/exceptions/enums/http-exception-enum';

export class CustomBadRequest extends CustomException {
  constructor(errorCode: string) {
    super(HttpExceptionStatusCode.BAD_REQUEST, errorCode);
  }
}
