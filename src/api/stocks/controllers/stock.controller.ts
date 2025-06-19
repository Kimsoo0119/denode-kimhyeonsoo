import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockService } from '../services/stock.service';
import { AccessTokenGuard } from '@core/jwt/guards/access-token.guard';
import { GetAuthorizedUser } from '@shared/decorators';
import { TokenPayload } from '@api/auth/interfaces/interface';
import { GetStockHistoriesDto } from '../dtos/requests/get-stock-histories.dto';
import { StockHistoryListDto } from '../dtos/responses/stock-history-list.dto';
import { ApiStock } from '../swaggers/stock.swagger';

@ApiTags('stocks')
@Controller('stocks')
@UseGuards(AccessTokenGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiStock.GetStockHistories({
    summary: '재고 이력 조회',
    description:
      '재고 ID를 기준으로 전체, 입고, 출고 이력을 조회합니다. 페이지 번호와 페이지당 조회 개수를 지정할 수 있습니다. 타입을 지정하지 않으면 전체 이력을 조회합니다.',
  })
  @Get(':stockId/histories')
  @UseGuards(AccessTokenGuard)
  async getStockHistories(
    @GetAuthorizedUser() user: TokenPayload,
    @Param('stockId', ParseIntPipe) stockId: number,
    @Query() getStockHistoryDto: GetStockHistoriesDto,
  ): Promise<StockHistoryListDto> {
    return await this.stockService.getStockHistories(
      user,
      stockId,
      getStockHistoryDto,
    );
  }
}
