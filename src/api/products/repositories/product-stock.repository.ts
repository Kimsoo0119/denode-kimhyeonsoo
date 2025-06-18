import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, IsNull, MoreThan } from 'typeorm';
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

  async findByProductId(
    productId: number,
    take?: number,
    offset?: number,
  ): Promise<ProductStock[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('ps')
      .where('ps.productId = :productId', { productId })
      .orderBy('ps.expirationAt IS NULL', 'ASC')
      .addOrderBy('ps.expirationAt', 'ASC');

    if (take) {
      queryBuilder.take(take);
    }
    if (offset) {
      queryBuilder.skip(offset);
    }

    return await queryBuilder.getMany();
  }

  async countByProductId(productId: number): Promise<number> {
    return await this.repository.count({
      where: { productId, quantity: MoreThan(0) },
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
