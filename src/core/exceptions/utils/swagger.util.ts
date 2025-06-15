import {
  AuthExceptionValue,
  CompanyExceptionValue,
  UserExceptionValue,
} from '@core/exceptions/constants';

type AllExceptionValues =
  | AuthExceptionValue
  | CompanyExceptionValue
  | UserExceptionValue;

export const toSwagger = (exception: AllExceptionValues) => ({
  error: exception.code,
  description: exception.message,
});

export const toSwaggers = (...exceptions: AllExceptionValues[]) =>
  exceptions.map(toSwagger);
