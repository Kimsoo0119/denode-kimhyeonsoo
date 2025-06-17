import { IsInt, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { RequiredApiProperty, OptionalApiProperty } from '@shared/decorators';

export class StockInDto {
  @RequiredApiProperty({
    description: '입고 수량',
    example: 100,
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @OptionalApiProperty({
    description: '유통기한 (YYYY-MM-DD 형식)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  expirationAt?: string;

  @OptionalApiProperty({
    description: '입고 관련 부가 설명',
  })
  @IsOptional()
  reason?: string;
}
