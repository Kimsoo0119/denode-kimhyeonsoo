import { ProductStock } from '@entities/product-stock.entity';

export interface StockUpdate {
  stock: ProductStock;
  outboundQuantity: number;
  afterQuantity: number;
}
