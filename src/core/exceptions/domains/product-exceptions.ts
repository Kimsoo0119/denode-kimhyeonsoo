import { ProductException } from '@core/exceptions/constants/product-exception.const';
import { CustomBadRequest, CustomNotFound } from '@core/exceptions/http';
import { CustomForbidden } from '@core/exceptions/http/custom-forbidden';

export namespace ProductExceptions {
  export class NotFound extends CustomNotFound {
    constructor() {
      super(
        ProductException.NOT_FOUND.code,
        ProductException.NOT_FOUND.message,
      );
    }
  }

  export class NotOwner extends CustomForbidden {
    constructor() {
      super(
        ProductException.NOT_OWNER.code,
        ProductException.NOT_OWNER.message,
      );
    }
  }

  export class NotFoundStock extends CustomNotFound {
    constructor() {
      super(
        ProductException.NOT_FOUND_STOCK.code,
        ProductException.NOT_FOUND_STOCK.message,
      );
    }
  }

  export class InvalidQuantity extends CustomBadRequest {
    constructor() {
      super(
        ProductException.INVALID_QUANTITY.code,
        ProductException.INVALID_QUANTITY.message,
      );
    }
  }
}
