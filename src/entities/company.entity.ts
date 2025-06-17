import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '@entities/user.entity';
import { Product } from '@entities/product.entity';
import { ProductStock } from '@entities/product-stock.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => ProductStock, (productStock) => productStock.company)
  productStocks: ProductStock[];
}
