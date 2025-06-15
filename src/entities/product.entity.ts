import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { Company } from '@entities/company.entity';
import { Inventory } from '@entities/inventory.entity';

@Entity('products')
@Index(['company_id', 'is_active'])
export class Product extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  companyId: number;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories: Inventory[];
}
