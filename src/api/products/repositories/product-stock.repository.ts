import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, IsNull } from 'typeorm';
import { ProductStock } from '@entities/product-stock.entity';

@Injectable()
export class ProductStockRepository {
  constructor(
    @InjectRepository(ProductStock)
    private readonly repository: Repository<ProductStock>,
  ) {}

  async trxFindByConditionWithLock(
    manager: EntityManager,
    productId: number,
    companyId: number,
    expirationAt: Date | null,
  ): Promise<ProductStock | null> {
    return await manager.findOne(ProductStock, {
      where: {
        productId,
        companyId,
        expirationAt: expirationAt ?? IsNull(),
      },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async findByProductId(productId: number): Promise<ProductStock[]> {
    return await this.repository.find({
      where: { productId },
    });
  }

  async trxCreate(
    manager: EntityManager,
    productStockData: Partial<ProductStock>,
  ): Promise<ProductStock> {
    const productStock = manager.create(ProductStock, productStockData);
    return await manager.save(productStock);
  }

  async trxUpdate(
    manager: EntityManager,
    productStock: ProductStock,
  ): Promise<ProductStock> {
    return await manager.save(productStock);
  }
}
