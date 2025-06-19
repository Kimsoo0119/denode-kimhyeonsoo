import { ApiOperationOptions, ApiOperator } from 'nest-swagger-builder';
import { CustomSwaggerBuilder } from '@core/swagger/custom-swagger-builder';
import { HttpStatus } from '@nestjs/common';
import { toSwaggers } from '@core/exceptions/utils';
import {
  AuthException,
  CommonException,
  CompanyException,
} from '@core/exceptions/constants';
import { StockController } from '@api/stocks/controllers/stock.controller';
import { StockHistoryListDto } from '@api/stocks/dtos/responses/stock-history-list.dto';

export const ApiStock: ApiOperator<keyof StockController> = {
  GetStockHistories: (apiOperationOptions: ApiOperationOptions) =>
    CustomSwaggerBuilder()
      .withOperation(apiOperationOptions)
      .withBearerAuth()
      .withBodyResponse(
        HttpStatus.OK,
        'ApiStock_GetStockHistory',
        StockHistoryListDto,
      )
      .withBadRequestResponse(toSwaggers(CommonException.INVALID_PAGE_RANGE))
      .withUnauthorizedResponse(
        toSwaggers(
          AuthException.UNAUTHORIZED,
          AuthException.NO_AUTH_TOKEN,
          AuthException.INVALID_TOKEN,
          AuthException.JWT_EXPIRED,
        ),
      )
      .withNotFoundResponse(toSwaggers(CompanyException.NOT_FOUND))
      .build(),
};
