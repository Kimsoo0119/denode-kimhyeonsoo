import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Check,
  Unique,
} from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { Product } from '@entities/product.entity';
import { Company } from '@entities/company.entity';
import { StockHistory } from '@entities/stock-history.entity';

@Entity('product_stock')
@Check('quantity >= 0')
@Unique(['productId', 'companyId', 'expirationAt'])
export class ProductStock extends BaseEntity {
  @Column()
  productId: number;

  @Column()
  companyId: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'date', nullable: true })
  expirationAt?: Date;

  @ManyToOne(() => Product, (product) => product.productStocks)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Company, (company) => company.productStocks)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => StockHistory, (history) => history.productStock)
  histories: StockHistory[];
}
