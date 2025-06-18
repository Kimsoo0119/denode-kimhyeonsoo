import { ProductWithTotalQuantityDto } from '@api/products/dtos/responses/product-with-total-quantity.dto';
import { ExposeApiProperty, RequiredApiProperty } from '@shared/decorators';
import { PaginationResponseDto } from '@shared/dots/response/pagination-response.dto';
import { Exclude, Type } from 'class-transformer';

@Exclude()
export class ProductListResponseDto extends PaginationResponseDto {
  @ExposeApiProperty({
    description: '제품 목록(수량 포함)',
    type: [ProductWithTotalQuantityDto],
  })
  @Type(() => ProductWithTotalQuantityDto)
  products: ProductWithTotalQuantityDto[];
}
