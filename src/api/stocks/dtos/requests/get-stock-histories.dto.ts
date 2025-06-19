import { PaginationParamsDto } from '@shared/dots/request/pagination-params.dto';
import { IsValidEnum, OptionalApiProperty } from '@shared/decorators';
import { StockHistoryType } from '@entities/stock-history.entity';

export class GetStockHistoriesDto extends PaginationParamsDto {
  @OptionalApiProperty({
    description: '재고 이력 타입 (IN: 입고, OUT: 출고)',
    enum: StockHistoryType,
    example: StockHistoryType.IN,
  })
  @IsValidEnum(StockHistoryType)
  type?: StockHistoryType;
}
