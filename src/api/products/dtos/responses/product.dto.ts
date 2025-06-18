import { ExposeApiProperty } from '@shared/decorators';
import { Exclude } from 'class-transformer';

@Exclude()
export class ProductDto {
  @ExposeApiProperty({
    description: '제품 ID',
    example: 1,
  })
  id: number;

  @ExposeApiProperty({
    description: '제품명',
    example: '아스피린 500mg',
  })
  name: string;

  @ExposeApiProperty({
    description: '제품 설명',
    example: '해열진통제',
    nullable: true,
  })
  description?: string;

  @ExposeApiProperty({
    description: '회사 ID',
    example: 1,
  })
  companyId: number;

  @ExposeApiProperty({
    description: '활성화 상태',
  })
  isActive: boolean;

  @ExposeApiProperty({
    description: '생성일시',
    example: '2024-06-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ExposeApiProperty({
    description: '수정일시',
    example: '2024-06-15T10:00:00.000Z',
  })
  updatedAt: Date;
}
