import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@entities/product.entity';
import { ProductStock } from '@entities/product-stock.entity';
import { StockHistory } from '@entities/stock-history.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import {
  ProductRepository,
  ProductStockRepository,
  StockHistoryRepository,
} from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductStock, StockHistory])],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    ProductStockRepository,
    StockHistoryRepository,
  ],
  exports: [ProductService],
})
export class ProductModule {}
