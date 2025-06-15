import { AuthExceptions } from '@core/exceptions/domains';

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AuthExceptions.InvalidEmail();
  }
}
