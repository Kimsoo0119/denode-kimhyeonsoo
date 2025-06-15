export const AuthException = {
  EMAIL_ALREADY_EXISTS: {
    code: 'D_01001',
    message: '이미 사용 중인 이메일입니다.',
  },
  INVALID_EMAIL: {
    code: 'D_01002',
    message: '이메일 형식이 올바르지 않습니다.',
  },
  INVALID_CREDENTIALS: {
    code: 'D_01003',
    message: '이메일 또는 비밀번호가 잘못되었습니다.',
  },
  INVALID_PASSWORD: {
    code: 'D_01004',
    message: '비밀번호가 올바르지 않습니다.',
  },
  INVALID_PASSWORD_LENGTH: {
    code: 'D_01005',
    message: '비밀번호 길이가 올바르지 않습니다.',
  },
  PASSWORD_MISSING_LETTER: {
    code: 'D_01006',
    message: '비밀번호에 영문자가 포함되어 있어야 합니다.',
  },
  PASSWORD_MISSING_NUMBER: {
    code: 'D_01007',
    message: '비밀번호에 숫자가 포함되어 있어야 합니다.',
  },
} as const;

export type AuthExceptionKey = keyof typeof AuthException;
export type AuthExceptionValue = (typeof AuthException)[AuthExceptionKey];
