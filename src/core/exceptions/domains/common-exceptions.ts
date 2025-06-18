import { CommonException } from '@core/exceptions/constants/common-exception.const';
import { CustomBadRequest } from '@core/exceptions/http';

export namespace CommonExceptions {
  export class InvalidPageRange extends CustomBadRequest {
    constructor() {
      super(
        CommonException.INVALID_PAGE_RANGE.code,
        CommonException.INVALID_PAGE_RANGE.message,
      );
    }
  }
}
