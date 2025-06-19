import { Exclude, Type } from 'class-transformer';
import { ExposeApiProperty } from '@shared/decorators';
import { StockHistoryType } from '@entities/stock-history.entity';
import { BaseUserDto } from '@shared/dots/response/base-user.dto';

@Exclude()
export class StockHistoryDto {
  @ExposeApiProperty({
    description: '재고 이력 ID',
    example: 1,
  })
  id: number;

  @ExposeApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ExposeApiProperty({
    description: '재고 이력 타입',
    enum: StockHistoryType,
    example: StockHistoryType.IN,
  })
  type: StockHistoryType;

  @ExposeApiProperty({
    description: '수량 변화량',
    example: 10,
  })
  quantity: number;

  @ExposeApiProperty({
    description: '설명',
    example: '초기 재고 입고',
    nullable: true,
  })
  reason?: string;

  @ExposeApiProperty({
    description: '재고 이력 생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ExposeApiProperty({
    description: '입고, 출고 담당자 정보',
    type: BaseUserDto,
  })
  @Type(() => BaseUserDto)
  user: BaseUserDto;
}
