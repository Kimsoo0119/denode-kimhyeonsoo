import { ProductExceptions } from '@core/exceptions/domains/product-exceptions';

export class StockInbound {
  private _productId: number;
  private _companyId: number;
  private _userId: number;
  private _quantity: number;
  private _expirationAt: Date | null;

  private constructor() {}

  private static validateQuantity(quantity: number) {
    if (!quantity || quantity <= 0) {
      throw new ProductExceptions.InvalidQuantity();
    }
  }

  static create(params: {
    productId: number;
    companyId: number;
    userId: number;
    quantity: number;
    expirationAt?: string | null;
  }): StockInbound {
    const { productId, companyId, userId, quantity, expirationAt } = params;
    const stockInbound = new StockInbound();

    StockInbound.validateQuantity(quantity);

    stockInbound._productId = productId;
    stockInbound._companyId = companyId;
    stockInbound._userId = userId;
    stockInbound._quantity = quantity;
    stockInbound._expirationAt = expirationAt ? new Date(expirationAt) : null;

    return stockInbound;
  }

  get productId() {
    return this._productId;
  }

  get companyId() {
    return this._companyId;
  }

  get userId() {
    return this._userId;
  }

  get quantity() {
    return this._quantity;
  }

  get expirationAt() {
    return this._expirationAt;
  }

  /**
   * ensureProductStockExists용 파라미터
   */
  get ensureParams() {
    return {
      productId: this._productId,
      companyId: this._companyId,
      expirationAt: this._expirationAt,
    };
  }

  /**
   * 데이터베이스 입력 형식으로 반환
   */
  get toDbInput() {
    return {
      productId: this._productId,
      companyId: this._companyId,
      userId: this._userId,
      quantity: this._quantity,
      expirationAt: this._expirationAt,
    };
  }
}
