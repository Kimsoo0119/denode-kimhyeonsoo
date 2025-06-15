import { CustomSwaggerBuilder } from '@core/swagger/custom-swagger-builder';
import { HttpStatus } from '@nestjs/common';
import { ApiOperator, ApiOperationOptions } from 'nest-swagger-builder';
import { ProductController } from '@api/products/controllers/product.controller';
import { toSwaggers } from '@core/exceptions/utils';
import { AuthException } from '@core/exceptions/constants';

export const ApiProduct: ApiOperator<keyof ProductController> = {
  CreateProduct: (apiOperationOptions: ApiOperationOptions) =>
    CustomSwaggerBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(HttpStatus.CREATED, 'ApiProduct_CreateProduct', Number)
      .withUnauthorizedResponse(
        toSwaggers(
          AuthException.UNAUTHORIZED,
          AuthException.NO_AUTH_TOKEN,
          AuthException.INVALID_TOKEN,
          AuthException.JWT_EXPIRED,
        ),
      )
      .build(),
};
