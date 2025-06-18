import { OptionalApiProperty } from '@shared/decorators';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParamsDto {
  @OptionalApiProperty({
    description: '페이지 번호 (1부터 시작)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetPage?: number = 1;

  @OptionalApiProperty({
    description: '페이지당 조회 개수',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take?: number = 10;
}
