import { Exclude, Type } from 'class-transformer';
import { PaginationResponseDto } from '@shared/dots/response/pagination-response.dto';
import { ExposeApiProperty } from '@shared/decorators';
import { StockHistoryDto } from './stock-history.dto';

@Exclude()
export class StockHistoryListDto extends PaginationResponseDto {
  @ExposeApiProperty({
    description: '재고 이력 목록',
    type: [StockHistoryDto],
  })
  @Type(() => StockHistoryDto)
  histories: StockHistoryDto[];
}
