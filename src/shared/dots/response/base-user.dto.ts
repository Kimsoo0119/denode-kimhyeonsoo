import { ExposeApiProperty } from '@shared/decorators';
import { Exclude } from 'class-transformer';

@Exclude()
export class BaseUserDto {
  @ExposeApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  id: number;

  @ExposeApiProperty({
    description: '사용자 이름',
    example: 'John Doe',
  })
  name: string;
}
