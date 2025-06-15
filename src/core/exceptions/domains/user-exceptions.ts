import { UserException } from '@core/exceptions/constants';
import { CustomBadRequest } from '@core/exceptions/http/custom-bad-request';

export namespace UserExceptions {
  export class EmptyName extends CustomBadRequest {
    constructor() {
      super(UserException.EMPTY_NAME.code, UserException.EMPTY_NAME.message);
    }
  }
}
