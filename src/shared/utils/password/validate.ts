import { AuthExceptions } from '@core/exceptions/domains';

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw new AuthExceptions.InvalidPasswordLength();
  }

  if (!/[a-zA-Z]/.test(password)) {
    throw new AuthExceptions.PasswordMissingLetter();
  }

  if (!/[0-9]/.test(password)) {
    throw new AuthExceptions.PasswordMissingNumber();
  }
}
