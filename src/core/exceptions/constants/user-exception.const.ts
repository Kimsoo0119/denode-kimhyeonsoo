export const UserException = {
  EMPTY_NAME: {
    code: 'D_03001',
    message: '이름은 비어있을 수 없습니다.',
  },
} as const;

export type UserExceptionKey = keyof typeof UserException;
export type UserExceptionValue = (typeof UserException)[UserExceptionKey];
