import { RequiredApiProperty } from '@shared/decorators';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @RequiredApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @RequiredApiProperty({
    description: '비밀번호',
    example: 'password123',
  })
  password: string;
}
