import { IsInt, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { RequiredApiProperty, OptionalApiProperty } from '@shared/decorators';

export class StockOutboundDto {
  @RequiredApiProperty({
    description: '출고 수량',
    example: 100,
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @OptionalApiProperty({
    description: '입고 관련 부가 설명',
  })
  @IsOptional()
  reason?: string;
}
