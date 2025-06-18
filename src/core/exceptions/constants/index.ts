import { AuthExceptionValue } from '@core/exceptions/constants/auth-exception.const';
import { CompanyExceptionValue } from '@core/exceptions/constants/company-exception.const';
import { UserExceptionValue } from '@core/exceptions/constants/user-exception.const';
import { ProductExceptionValue } from '@core/exceptions/constants/product-exception.const';
import { CommonExceptionValue } from '@core/exceptions/constants/common-exception.const';

export * from './auth-exception.const';
export * from './company-exception.const';
export * from './product-exception.const';
export * from './user-exception.const';
export * from './common-exception.const';

export type AllExceptionValues =
  | AuthExceptionValue
  | CompanyExceptionValue
  | UserExceptionValue
  | ProductExceptionValue
  | CommonExceptionValue;
