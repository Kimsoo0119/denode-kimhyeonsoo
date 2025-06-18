import { Exclude } from 'class-transformer';
import { ExposeApiProperty } from '../../decorators';

@Exclude()
export class PaginationResponseDto {
  @ExposeApiProperty({
    description: '현재 페이지',
    example: 1,
  })
  currentPage: number;

  @ExposeApiProperty({
    description: '총 페이지 수',
    example: 10,
  })
  totalPages: number;

  @ExposeApiProperty({
    description: '총 개수',
    example: 100,
  })
  totalItemCount: number;
}
