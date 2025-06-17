import { Entity, Column, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { ProductStock } from '@entities/product-stock.entity';
import { User } from '@entities/user.entity';

export enum StockHistoryType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('stock_history')
@Check(`
  (type = 'IN' AND quantity > 0) OR 
  (type = 'OUT' AND quantity < 0)
`)
export class StockHistory extends BaseEntity {
  @Column()
  productStockId: number;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: StockHistoryType })
  type: StockHistoryType;

  @Column()
  quantity: number;

  @Column({ length: 255, nullable: true })
  reason?: string;

  @Column({ name: 'total_inbound', default: 0 })
  totalInbound: number;

  @Column({ name: 'total_outbound', default: 0 })
  totalOutbound: number;

  @ManyToOne(() => ProductStock, (productStock) => productStock.histories)
  @JoinColumn({ name: 'product_stock_id' })
  productStock: ProductStock;

  @ManyToOne(() => User, (user) => user.stockHistories)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
