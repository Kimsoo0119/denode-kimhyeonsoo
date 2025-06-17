import { RequiredApiProperty } from '@shared/decorators';

export class ProcessedStockDto {
  @RequiredApiProperty({
    description: '처리된 재고 ID',
    example: 1,
  })
  productStockId: number;

  @RequiredApiProperty({
    description: '유통기한',
    example: '2024-12-31',
    nullable: true,
  })
  expirationAt: Date | null;

  @RequiredApiProperty({
    description: '차감 수량',
    example: 50,
  })
  reductionQuantity: number;

  @RequiredApiProperty({
    description: '남은 수량',
    example: 100,
  })
  remainingQuantity: number;
}

export class OutboundResponseDto {
  @RequiredApiProperty({
    description: '총 출고 수량',
    example: 100,
  })
  outboundQuantity: number;

  @RequiredApiProperty({
    description: '처리된 재고 목록',
    type: [ProcessedStockDto],
  })
  processedStocks: ProcessedStockDto[];
}
