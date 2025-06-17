import { ProductExceptions } from '@core/exceptions/domains';

export class OutboundRequest {
  private _productId: number;
  private _companyId: number;
  private _userId: number;
  private _quantity: number;
  private _reason?: string;

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
    reason?: string;
  }): OutboundRequest {
    const { productId, companyId, userId, quantity, reason } = params;
    const outboundRequest = new OutboundRequest();

    OutboundRequest.validateQuantity(quantity);

    outboundRequest._productId = productId;
    outboundRequest._companyId = companyId;
    outboundRequest._userId = userId;
    outboundRequest._quantity = quantity;
    outboundRequest._reason = reason;

    return outboundRequest;
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

  get reason() {
    return this._reason;
  }
}
