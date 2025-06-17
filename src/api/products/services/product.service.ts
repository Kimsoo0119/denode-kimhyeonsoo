import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Product } from '@entities/product.entity';
import { ProductStock } from '@entities/product-stock.entity';
import { StockHistoryType } from '@entities/stock-history.entity';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { StockInDto } from '../dtos/requests/stock-in.dto';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { ProductExceptions } from '@core/exceptions/domains/product-exceptions';
import { StockInbound } from '../domains/stock-inbound';
import {
  ProductRepository,
  ProductStockRepository,
  StockHistoryRepository,
} from '../repositories';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productRepository: ProductRepository,
    private readonly productStockRepository: ProductStockRepository,
    private readonly stockHistoryRepository: StockHistoryRepository,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    companyId: number,
  ): Promise<number> {
    const savedProduct = await this.productRepository.create({
      ...createProductDto,
      companyId,
      isActive: false,
    });

    return savedProduct.id;
  }

  async processInbound(
    user: TokenPayload,
    productId: number,
    stockInDto: StockInDto,
  ): Promise<void> {
    const product = await this.validateProductOwnership(
      productId,
      user.companyId,
    );

    const stockInbound = StockInbound.create({
      productId,
      companyId: user.companyId,
      userId: user.userId,
      quantity: stockInDto.quantity,
      expirationAt: stockInDto.expirationAt,
    });

    await this.ensureProductStockExists(stockInbound.ensureParams);

    await this.dataSource.transaction(async (manager) => {
      const productStock = await this.updateProductStockQuantity(
        manager,
        stockInbound,
      );

      await this.createStockHistory(
        manager,
        productStock.id,
        stockInbound.userId,
        stockInbound.quantity,
        StockHistoryType.IN,
        stockInDto.reason,
      );

      await this.activateProductIfNeeded(manager, product);
    });
  }

  private async validateProductOwnership(
    productId: number,
    companyId: number,
  ): Promise<Product> {
    const selectedProduct = await this.productRepository.findById(productId);

    if (!selectedProduct) {
      throw new ProductExceptions.NotFound();
    }

    if (selectedProduct.companyId !== companyId) {
      throw new ProductExceptions.NotOwner();
    }

    return selectedProduct;
  }

  private async ensureProductStockExists({
    productId,
    companyId,
    expirationAt,
  }: {
    productId: number;
    companyId: number;
    expirationAt: Date | null;
  }): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO product_stock (product_id, company_id, quantity, expiration_at, created_at, updated_at) 
       VALUES (?, ?, 0, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE quantity = quantity + 0`,
      [productId, companyId, expirationAt],
    );
  }

  private async updateProductStockQuantity(
    manager: EntityManager,
    stockInbound: StockInbound,
  ): Promise<ProductStock> {
    const productStock =
      await this.productStockRepository.trxFindByConditionWithLock(
        manager,
        stockInbound.productId,
        stockInbound.companyId,
        stockInbound.expirationAt,
      );

    if (!productStock) {
      throw new ProductExceptions.NotFoundStock();
    }

    productStock.quantity += stockInbound.quantity;

    return await this.productStockRepository.trxUpdate(manager, productStock);
  }

  private async createStockHistory(
    manager: EntityManager,
    productStockId: number,
    userId: number,
    quantity: number,
    type: StockHistoryType,
    reason?: string,
  ): Promise<void> {
    const lastHistory = await this.stockHistoryRepository.trxFindLastWithLock(
      manager,
      productStockId,
    );

    const totalInbound =
      type === StockHistoryType.IN
        ? (lastHistory?.totalInbound || 0) + quantity
        : lastHistory?.totalInbound || 0;
    const totalOutbound =
      type === StockHistoryType.OUT
        ? (lastHistory?.totalOutbound || 0) + quantity
        : lastHistory?.totalOutbound || 0;

    await this.stockHistoryRepository.trxCreate(manager, {
      productStockId,
      userId,
      type,
      quantity,
      reason,
      totalInbound,
      totalOutbound,
    });
  }

  private async activateProductIfNeeded(
    manager: EntityManager,
    product: Product,
  ): Promise<void> {
    if (!product.isActive) {
      product.isActive = true;
      await this.productRepository.trxUpdate(manager, product);
    }
  }
}
