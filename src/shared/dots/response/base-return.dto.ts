import { ExposeApiProperty } from '@shared/decorators';
import { Exclude } from 'class-transformer';

@Exclude()
export class BaseReturnDto {
  @ExposeApiProperty({
    description: 'ID',
    example: 1,
  })
  id: number;

  @ExposeApiProperty({
    description: '생성일',
    example: '2024-06-15T10:00:00.000Z',
  })
  createdAt: Date;

  @ExposeApiProperty({
    description: '수정일',
    example: '2024-06-15T10:00:00.000Z',
  })
  updatedAt: Date;
}
