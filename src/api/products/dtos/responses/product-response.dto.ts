import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: '제품 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '제품명',
    example: '아스피린 500mg',
  })
  name: string;

  @ApiProperty({
    description: '제품 설명',
    example: '해열진통제',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: '회사 ID',
    example: 1,
  })
  companyId: number;

  @ApiProperty({
    description: '활성화 상태',
    example: false,
  })
  isActive: boolean;

  @ApiProperty({
    description: '생성일시',
    example: '2024-06-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-06-15T10:00:00.000Z',
  })
  updatedAt: Date;
}
