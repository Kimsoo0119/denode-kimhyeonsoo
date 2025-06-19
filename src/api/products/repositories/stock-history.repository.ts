import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { StockHistory, StockHistoryType } from '@entities/stock-history.entity';

@Injectable()
export class StockHistoryRepository {
  constructor(
    @InjectRepository(StockHistory)
    private readonly repository: Repository<StockHistory>,
  ) {}

  async trxFindLastWithLock(
    manager: EntityManager,
    productStockId: number,
  ): Promise<StockHistory | null> {
    return await manager.findOne(StockHistory, {
      where: { productStockId },
      order: { createdAt: 'DESC' },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async trxCreate(
    manager: EntityManager,
    historyData: Partial<StockHistory>,
  ): Promise<StockHistory> {
    const history = manager.create(StockHistory, historyData);
    return await manager.save(history);
  }

  async findAndCountWithUser(
    productStockId: number,
    type?: StockHistoryType,
    take?: number,
    skip?: number,
  ): Promise<[StockHistory[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('sh')
      .leftJoinAndSelect('sh.user', 'u')
      .where('sh.productStockId = :productStockId', { productStockId });

    if (type) {
      queryBuilder.andWhere('sh.type = :type', { type });
    }

    queryBuilder.orderBy('sh.createdAt', 'DESC').take(take).skip(skip);

    return await queryBuilder.getManyAndCount();
  }
}
