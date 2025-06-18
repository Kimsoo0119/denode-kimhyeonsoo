import { ExposeApiProperty } from '@shared/decorators';
import { ProductDto } from './product.dto';
import { Exclude, Transform } from 'class-transformer';

@Exclude()
export class ProductWithTotalQuantityDto extends ProductDto {
  @ExposeApiProperty({
    description: '총 재고 수량',
    example: 100,
  })
  @Transform(({ value }) => Number(value))
  totalQuantity: number;
}
