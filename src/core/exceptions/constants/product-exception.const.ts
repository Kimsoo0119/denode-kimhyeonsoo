export const ProductException = {
  NOT_FOUND: {
    code: 'D_04001',
    message: '제품을 찾을 수 없습니다.',
  },
  NOT_OWNER: {
    code: 'D_04002',
    message: '해당 제품을 보유하고 있지 않습니다.',
  },
  NOT_FOUND_STOCK: {
    code: 'D_04003',
    message: '제품 재고를 찾을 수 없습니다.',
  },
  INVALID_INBOUND_QUANTITY: {
    code: 'D_04004',
    message: '입고 수량은 0보다 커야 합니다.',
  },
  INVALID_OUTBOUND_QUANTITY: {
    code: 'D_04005',
    message: '출고 수량은 0보다 커야 합니다.',
  },
  INSUFFICIENT_STOCK: {
    code: 'D_04006',
    message: '출고 가능한 재고가 부족합니다.',
  },
} as const;

export type ProductExceptionKey = keyof typeof ProductException;
export type ProductExceptionValue =
  (typeof ProductException)[ProductExceptionKey];
