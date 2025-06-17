import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { StockHistory } from '@entities/stock-history.entity';

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
}
