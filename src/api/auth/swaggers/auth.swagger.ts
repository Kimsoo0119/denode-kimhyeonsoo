import { AuthController } from '@api/auth/controllers/auth.controller';
import { CustomSwaggerBuilder } from '@core/swagger/custom-swagger-builder';
import { HttpStatus } from '@nestjs/common';
import { ApiOperator, ApiOperationOptions } from 'nest-swagger-builder';
import {
  AuthException,
  CompanyException,
  UserException,
} from '@core/exceptions/constants';
import { toSwaggers } from '@core/exceptions/utils';
import { LoginResponseDto } from '@api/auth/dtos/responses/login-response.dto';

export const ApiAuth: ApiOperator<keyof AuthController> = {
  Signup: (apiOperationOptions: ApiOperationOptions) =>
    CustomSwaggerBuilder()
      .withOperation(apiOperationOptions)
      .withStatusResponse(HttpStatus.CREATED, 'ApiAuth_Signup')
      .withBadRequestResponse(
        toSwaggers(
          AuthException.EMAIL_ALREADY_EXISTS,
          AuthException.INVALID_EMAIL,
          AuthException.INVALID_PASSWORD_LENGTH,
          AuthException.PASSWORD_MISSING_LETTER,
          AuthException.PASSWORD_MISSING_NUMBER,
          UserException.EMPTY_NAME,
        ),
      )
      .withNotFoundResponse(toSwaggers(CompanyException.NOT_FOUND))
      .build(),

  Login: (apiOperationOptions: ApiOperationOptions) =>
    CustomSwaggerBuilder()
      .withOperation(apiOperationOptions)
      .withBodyResponse(HttpStatus.CREATED, 'ApiAuth_Login', LoginResponseDto)
      .withBadRequestResponse(toSwaggers(AuthException.INVALID_CREDENTIALS))
      .build(),
};
