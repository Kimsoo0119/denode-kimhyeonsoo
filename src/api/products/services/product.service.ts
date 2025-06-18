import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Product } from '@entities/product.entity';
import { ProductStock } from '@entities/product-stock.entity';
import { StockHistory, StockHistoryType } from '@entities/stock-history.entity';
import { CreateProductDto } from '../dtos/requests/create-product.dto';
import { StockInboundDto } from '../dtos/requests/stock-inbound.dto';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { ProductExceptions } from '@core/exceptions/domains/product-exceptions';
import { StockInbound } from '../domains/stock-inbound';
import {
  ProductRepository,
  ProductStockRepository,
  StockHistoryRepository,
} from '../repositories';
import { OutboundRequest } from '../domains/outbound-request';
import { StockOutboundDto } from '@api/products/dtos/requests/stock-outbound.dto';
import { StockUpdate } from '@api/products/interface/interface';
import { ProductListResponseDto } from '../dtos/responses/product-list-response.dto';
import { GetProductsDto } from '@api/products/dtos/requests/get-products.dto';
import { plainToInstance } from 'class-transformer';
import { CommonExceptions } from '@core/exceptions/domains';

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
    stockInboundDto: StockInboundDto,
  ): Promise<void> {
    const product = await this.validateProductOwnership(
      productId,
      user.companyId,
    );

    const stockInbound = StockInbound.create({
      productId,
      companyId: user.companyId,
      userId: user.userId,
      quantity: stockInboundDto.quantity,
      expirationAt: stockInboundDto.expirationAt,
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
        stockInboundDto.reason,
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
    if (expirationAt === null) {
      await this.dataSource.query(
        `INSERT INTO product_stock (product_id, company_id, quantity, expiration_at) 
         SELECT ?, ?, 0, NULL
         WHERE NOT EXISTS (
           SELECT 1 FROM product_stock 
           WHERE product_id = ? AND company_id = ? AND expiration_at IS NULL
         )`,
        [productId, companyId, productId, companyId],
      );
    } else {
      await this.dataSource.query(
        `INSERT INTO product_stock (product_id, company_id, quantity, expiration_at) 
         VALUES (?, ?, 0, ?)
         ON DUPLICATE KEY UPDATE quantity = quantity + 0`,
        [productId, companyId, expirationAt],
      );
    }
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
        ? (lastHistory?.totalOutbound || 0) - quantity
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

  private async deactivateProduct(
    manager: EntityManager,
    productId: number,
  ): Promise<void> {
    const product = await manager.findOne(Product, {
      where: { id: productId },
    });
    if (product && product.isActive) {
      product.isActive = false;
      await this.productRepository.trxUpdate(manager, product);
    }
  }

  async processOutbound(
    user: TokenPayload,
    productId: number,
    stockOutboundDto: StockOutboundDto,
  ): Promise<void> {
    await this.validateProductOwnership(productId, user.companyId);

    const outboundRequest = OutboundRequest.create({
      productId,
      companyId: user.companyId,
      userId: user.userId,
      quantity: stockOutboundDto.quantity,
      reason: stockOutboundDto.reason,
    });

    await this.dataSource.transaction(async (manager) => {
      const availableStocks = await this.getAvailableStocksWithLock(
        manager,
        outboundRequest.productId,
        outboundRequest.companyId,
      );

      const availableQuantity =
        this.calculateAvailableQuantity(availableStocks);
      this.validateStockSufficiency(
        availableQuantity,
        outboundRequest.quantity,
      );

      await this.processFIFOOutbound(manager, outboundRequest, availableStocks);

      if (outboundRequest.quantity === availableQuantity) {
        await this.deactivateProduct(manager, outboundRequest.productId);
      }
    });
  }

  private async getAvailableStocksWithLock(
    manager: EntityManager,
    productId: number,
    companyId: number,
  ): Promise<ProductStock[]> {
    const stocks = await manager
      .createQueryBuilder(ProductStock, 'ps')
      .where('ps.productId = :productId', { productId })
      .andWhere('ps.companyId = :companyId', { companyId })
      .andWhere('ps.quantity > 0')
      .orderBy('ps.expirationAt IS NULL', 'ASC')
      .addOrderBy('ps.expirationAt', 'ASC')
      .setLock('pessimistic_write')
      .getMany();

    if (stocks.length === 0) {
      throw new ProductExceptions.InsufficientStock();
    }

    return stocks;
  }

  private calculateAvailableQuantity(availableStocks: ProductStock[]): number {
    return availableStocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }

  private validateStockSufficiency(
    availableQuantity: number,
    requestedQuantity: number,
  ): void {
    if (availableQuantity < requestedQuantity) {
      throw new ProductExceptions.InsufficientStock();
    }
  }

  private async processFIFOOutbound(
    manager: EntityManager,
    outboundRequest: OutboundRequest,
    availableStocks: ProductStock[],
  ): Promise<void> {
    const stockUpdates = this.calculateStockReductions(
      availableStocks,
      outboundRequest.quantity,
    );

    const lastStockHistories = await this.batchGetLastStockHistories(
      manager,
      stockUpdates.map((update) => update.stock.id),
    );

    await this.batchUpdateProductStocks(manager, stockUpdates);

    await this.batchCreateOutboundHistories(
      manager,
      stockUpdates,
      lastStockHistories,
      outboundRequest.userId,
      outboundRequest.reason,
    );
  }

  private calculateStockReductions(
    availableStocks: ProductStock[],
    requestedQuantity: number,
  ): StockUpdate[] {
    const stockUpdates: StockUpdate[] = [];
    let remainingQuantity = requestedQuantity;

    for (const stock of availableStocks) {
      if (remainingQuantity <= 0) break;

      const outboundQuantity = Math.min(remainingQuantity, stock.quantity);

      stockUpdates.push({
        stock,
        outboundQuantity,
        afterQuantity: stock.quantity - outboundQuantity,
      });

      remainingQuantity -= outboundQuantity;
    }

    return stockUpdates;
  }

  private async batchGetLastStockHistories(
    manager: EntityManager,
    stockIds: number[],
  ): Promise<Map<number, StockHistory | null>> {
    const historyMap = new Map<number, StockHistory | null>();

    if (stockIds.length === 0) return historyMap;

    const placeholders = stockIds.map(() => '?').join(',');
    const lastHistories = await manager.query(
      `SELECT sh1.* 
       FROM stock_history sh1
       INNER JOIN (
         SELECT product_stock_id, MAX(created_at) as max_created_at
         FROM stock_history 
         WHERE product_stock_id IN (${placeholders})
         GROUP BY product_stock_id
       ) sh2 ON sh1.product_stock_id = sh2.product_stock_id 
                AND sh1.created_at = sh2.max_created_at
       FOR UPDATE`,
      stockIds,
    );

    lastHistories.forEach((history: any) => {
      historyMap.set(history.product_stock_id, {
        id: history.id,
        productStockId: history.product_stock_id,
        userId: history.user_id,
        type: history.type,
        quantity: history.quantity,
        reason: history.reason,
        totalInbound: history.total_inbound,
        totalOutbound: history.total_outbound,
        createdAt: history.created_at,
        updatedAt: history.updated_at,
      } as StockHistory);
    });

    stockIds.forEach((stockId) => {
      if (!historyMap.has(stockId)) {
        historyMap.set(stockId, null);
      }
    });

    return historyMap;
  }

  private async batchUpdateProductStocks(
    manager: EntityManager,
    stockUpdates: StockUpdate[],
  ): Promise<void> {
    if (stockUpdates.length === 0) return;

    const caseStatements = stockUpdates
      .map((update) => `WHEN ${update.stock.id} THEN ${update.afterQuantity}`)
      .join(' ');

    const stockIds = stockUpdates.map((update) => update.stock.id).join(',');

    await manager.query(
      `UPDATE product_stock 
       SET quantity = CASE id ${caseStatements} END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id IN (${stockIds})`,
    );
  }

  private async batchCreateOutboundHistories(
    manager: EntityManager,
    stockUpdates: StockUpdate[],
    lastStockHistories: Map<number, StockHistory | null>,
    userId: number,
    reason?: string,
  ): Promise<void> {
    if (stockUpdates.length === 0) return;

    const values = stockUpdates
      .map((update) => {
        const lastStockHistory = lastStockHistories.get(update.stock.id);
        const totalInbound = lastStockHistory?.totalInbound || 0;
        const totalOutbound =
          (lastStockHistory?.totalOutbound || 0) - update.outboundQuantity;

        return `(
        DEFAULT, 
        DEFAULT, 
        DEFAULT, 
        ${update.stock.id}, 
        ${userId}, 
        'OUT', 
        ${-update.outboundQuantity}, 
        ${reason ? `'${reason}'` : 'NULL'}, 
        ${totalInbound}, 
        ${totalOutbound}
      )`;
      })
      .join(',\n');

    await manager.query(
      `INSERT INTO stock_history (
        id, 
        created_at, 
        updated_at, 
        product_stock_id, 
        user_id, 
        type, 
        quantity, 
        reason, 
        total_inbound, 
        total_outbound
      ) VALUES ${values}`,
    );
  }

  async getProducts(
    companyId: number,
    getProductsDto: GetProductsDto,
  ): Promise<ProductListResponseDto> {
    const { targetPage = 1, take = 10 } = getProductsDto;
    const offset = (targetPage - 1) * take;

    const [products, totalItemCount] = await Promise.all([
      this.productRepository.findProductsWithTotalQuantity(
        companyId,
        take,
        offset,
      ),
      this.productRepository.countActiveProducts(companyId),
    ]);

    const totalPages = Math.ceil(totalItemCount / take);

    if (targetPage > totalPages) {
      throw new CommonExceptions.InvalidPageRange();
    }

    return plainToInstance(ProductListResponseDto, {
      currentPage: targetPage,
      totalPages,
      totalItemCount,
      products,
    });
  }
}
