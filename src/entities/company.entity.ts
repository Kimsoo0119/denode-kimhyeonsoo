import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '@entities/user.entity';
import { Product } from '@entities/product.entity';
import { Inventory } from '@entities/inventory.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => Inventory, (inventory) => inventory.company)
  inventories: Inventory[];
}
