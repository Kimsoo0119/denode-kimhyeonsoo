import { ExposeApiProperty } from '@shared/decorators';
import { BaseReturnDto } from '@shared/dots/response/base-return.dto';
import { PaginationResponseDto } from '@shared/dots/response/pagination-response.dto';
import { Exclude, Type } from 'class-transformer';

@Exclude()
export class ProductStockDto extends BaseReturnDto {
  @ExposeApiProperty({
    description: '제품명',
    example: '아스피린 500mg',
  })
  name: string;

  @ExposeApiProperty({
    description: '재고 수량',
    example: 100,
  })
  quantity: number;

  @ExposeApiProperty({
    description: '유통기한',
    example: '2024-06-15T10:00:00.000Z',
    nullable: true,
  })
  expirationAt: Date | null;

  @ExposeApiProperty({
    description: '상품 ID',
    example: 1,
  })
  productId: number;

  @ExposeApiProperty({
    description: '회사 ID',
    example: 1,
  })
  companyId: number;
}

@Exclude()
export class ProductStockListResponseDto extends PaginationResponseDto {
  @ExposeApiProperty({
    description: '재고 목록',
    type: [ProductStockDto],
  })
  @Type(() => ProductStockDto)
  productStocks: ProductStockDto[];
}
