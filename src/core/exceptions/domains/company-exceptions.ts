import { CompanyException } from '@core/exceptions/constants';
import { CustomNotFound } from '@core/exceptions/http';

export namespace CompanyExceptions {
  export class NotFound extends CustomNotFound {
    constructor() {
      super(
        CompanyException.NOT_FOUND.code,
        CompanyException.NOT_FOUND.message,
      );
    }
  }
}
