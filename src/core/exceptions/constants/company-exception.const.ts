export const CompanyException = {
  NOT_FOUND: {
    code: 'D_02001',
    message: '회사를 찾을 수 없습니다.',
  },
} as const;

export type CompanyExceptionKey = keyof typeof CompanyException;
export type CompanyExceptionValue =
  (typeof CompanyException)[CompanyExceptionKey];
