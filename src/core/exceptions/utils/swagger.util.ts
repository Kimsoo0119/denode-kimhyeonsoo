import {
  AuthExceptionValue,
  CompanyExceptionValue,
  ProductExceptionValue,
  UserExceptionValue,
} from '@core/exceptions/constants';

type AllExceptionValues =
  | AuthExceptionValue
  | CompanyExceptionValue
  | UserExceptionValue
  | ProductExceptionValue;

export const toSwagger = (exception: AllExceptionValues) => ({
  error: exception.code,
  description: exception.message,
});

export const toSwaggers = (...exceptions: AllExceptionValues[]) =>
  exceptions.map(toSwagger);
