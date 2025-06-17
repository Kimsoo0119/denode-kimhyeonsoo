import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from '@entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOneBy({ id });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.repository.create(productData);

    return await this.repository.save(product);
  }

  async trxUpdate(manager: EntityManager, product: Product): Promise<Product> {
    return await manager.save(product);
  }
}
