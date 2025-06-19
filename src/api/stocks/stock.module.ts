import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStock } from '@entities/product-stock.entity';
import { StockHistory } from '@entities/stock-history.entity';
import { StockController } from './controllers/stock.controller';
import { StockService } from './services/stock.service';
import { StockHistoryRepository } from '@api/products/repositories/stock-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStock, StockHistory])],
  controllers: [StockController],
  providers: [StockService, StockHistoryRepository],
  exports: [StockService],
})
export class StockModule {}
