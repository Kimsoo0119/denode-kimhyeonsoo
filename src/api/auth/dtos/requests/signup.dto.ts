import { IsEmail, IsNumber } from 'class-validator';
import {
  RequiredApiProperty,
  IsLength,
} from '@shared/decorators/common.decorator';
import { USER_CONST } from '@shared/consts/user-profile';

export class SignupDto {
  @RequiredApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    minLength: USER_CONST.MIN_NAME_LENGTH,
    maxLength: USER_CONST.MAX_NAME_LENGTH,
  })
  @IsLength(USER_CONST.MIN_NAME_LENGTH, USER_CONST.MAX_NAME_LENGTH)
  name: string;

  @RequiredApiProperty({
    description: '이메일',
    example: 'user@example.com',
    format: 'email',
    minLength: USER_CONST.MIN_EMAIL_LENGTH,
    maxLength: USER_CONST.MAX_EMAIL_LENGTH,
  })
  @IsEmail()
  @IsLength(USER_CONST.MIN_EMAIL_LENGTH, USER_CONST.MAX_EMAIL_LENGTH)
  email: string;

  @RequiredApiProperty({
    description: '비밀번호',
    example: 'password123',
    minLength: USER_CONST.MIN_PASSWORD_LENGTH,
    maxLength: USER_CONST.MAX_PASSWORD_LENGTH,
  })
  @IsLength(USER_CONST.MIN_PASSWORD_LENGTH, USER_CONST.MAX_PASSWORD_LENGTH)
  password: string;

  @RequiredApiProperty({
    description: '회사 ID',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  companyId: number;
}
