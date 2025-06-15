import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/requests/signup.dto';
import { ApiAuth } from '@api/auth/swaggers/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiAuth.Signup({ summary: '회원가입' })
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    return await this.authService.signup(signupDto);
  }
}
