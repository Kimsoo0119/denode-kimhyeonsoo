import { AllExceptionValues } from '@core/exceptions/constants';

export const toSwagger = (exception: AllExceptionValues) => ({
  error: exception.code,
  description: exception.message,
});

export const toSwaggers = (...exceptions: AllExceptionValues[]) =>
  exceptions.map(toSwagger);
