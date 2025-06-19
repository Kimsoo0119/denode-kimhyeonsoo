import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductStock } from '@entities/product-stock.entity';
import { StockHistoryRepository } from '@api/products/repositories/stock-history.repository';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { ProductExceptions } from '@core/exceptions/domains/product-exceptions';
import { GetStockHistoriesDto } from '../dtos/requests/get-stock-histories.dto';
import { StockHistoryListDto } from '../dtos/responses/stock-history-list.dto';
import { plainToInstance } from 'class-transformer';
import { CommonExceptions } from '@core/exceptions/domains';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(ProductStock)
    private readonly productStockRepository: Repository<ProductStock>,
    private readonly stockHistoryRepository: StockHistoryRepository,
  ) {}

  async getStockHistories(
    user: TokenPayload,
    stockId: number,
    getStockHistoryDto: GetStockHistoriesDto,
  ): Promise<StockHistoryListDto> {
    const productStock = await this.productStockRepository.findOne({
      where: { id: stockId, companyId: user.companyId },
    });

    if (!productStock) {
      throw new ProductExceptions.NotFoundStock();
    }

    const { targetPage, take, type } = getStockHistoryDto;
    const offset = (targetPage! - 1) * take!;

    const [histories, totalItemCount] =
      await this.stockHistoryRepository.findAndCountWithUser(
        stockId,
        type,
        take!,
        offset,
      );

    const totalPages = Math.ceil(totalItemCount / take);
    if (targetPage > totalPages) {
      throw new CommonExceptions.InvalidPageRange();
    }

    return plainToInstance(StockHistoryListDto, {
      currentPage: targetPage!,
      totalPages,
      totalItemCount,
      histories,
    });
  }
}
