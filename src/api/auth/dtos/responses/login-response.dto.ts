import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access Token',
    example: 'accessToken',
  })
  accessToken: string;
}
