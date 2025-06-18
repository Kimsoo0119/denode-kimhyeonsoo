import {
  IsPositive,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { RequiredApiProperty, OptionalApiProperty } from '@shared/decorators';

export class StockInboundDto {
  @RequiredApiProperty({
    description: '입고 수량',
    example: 100,
  })
  @IsNumber()
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
