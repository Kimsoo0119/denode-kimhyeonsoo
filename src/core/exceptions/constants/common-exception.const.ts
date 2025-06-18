export const CommonException = {
  INVALID_PAGE_RANGE: {
    code: 'C_00001',
    message: '유효한 페이지 범위가 아닙니다.',
  },
} as const;

export type CommonExceptionKey = keyof typeof CommonException;
export type CommonExceptionValue = (typeof CommonException)[CommonExceptionKey];
