import { CustomConflict } from '@core/exceptions/http/custom-conflict';
import { CustomBadRequest } from '@core/exceptions/http/custom-bad-request';
import { AuthException } from '@core/exceptions/constants';

export namespace AuthExceptions {
  export class EmailAlreadyExists extends CustomConflict {
    constructor() {
      super(
        AuthException.EMAIL_ALREADY_EXISTS.code,
        AuthException.EMAIL_ALREADY_EXISTS.message,
      );
    }
  }

  export class InvalidEmail extends CustomBadRequest {
    constructor() {
      super(
        AuthException.INVALID_EMAIL.code,
        AuthException.INVALID_EMAIL.message,
      );
    }
  }

  export class InvalidCredentials extends CustomBadRequest {
    constructor() {
      super(
        AuthException.INVALID_CREDENTIALS.code,
        AuthException.INVALID_CREDENTIALS.message,
      );
    }
  }

  export class InvalidPassword extends CustomBadRequest {
    constructor() {
      super(
        AuthException.INVALID_PASSWORD.code,
        AuthException.INVALID_PASSWORD.message,
      );
    }
  }

  export class InvalidPasswordLength extends CustomBadRequest {
    constructor() {
      super(
        AuthException.INVALID_PASSWORD_LENGTH.code,
        AuthException.INVALID_PASSWORD_LENGTH.message,
      );
    }
  }

  export class PasswordMissingLetter extends CustomBadRequest {
    constructor() {
      super(
        AuthException.PASSWORD_MISSING_LETTER.code,
        AuthException.PASSWORD_MISSING_LETTER.message,
      );
    }
  }

  export class PasswordMissingNumber extends CustomBadRequest {
    constructor() {
      super(
        AuthException.PASSWORD_MISSING_NUMBER.code,
        AuthException.PASSWORD_MISSING_NUMBER.message,
      );
    }
  }
}
