import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  VersionColumn,
  Check,
} from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { Product } from '@entities/product.entity';
import { Company } from '@entities/company.entity';
import { InventoryHistory } from '@entities/inventory-history.entity';

@Entity('inventory')
@Check('quantity >= 0')
export class Inventory extends BaseEntity {
  @Column()
  productId: number;

  @Column()
  companyId: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'date', nullable: true })
  expirationDate?: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => Product, (product) => product.inventories)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Company, (company) => company.inventories)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => InventoryHistory, (history) => history.inventory)
  histories: InventoryHistory[];
}
