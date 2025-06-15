import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthTokenService } from '../services/auth-token.service';
import { SignupDto } from '../dtos/requests/signup.dto';
import { LoginDto } from '../dtos/requests/login.dto';
import { ApiAuth } from '@api/auth/swaggers/auth.swagger';
import { LoginResponseDto } from '@api/auth/dtos/responses/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  @ApiAuth.Signup({ summary: '회원가입' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    return await this.authService.signup(signupDto);
  }

  @ApiAuth.Login({ summary: '로그인' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const userData = await this.authService.login(loginDto);

    const tokens = await this.authTokenService.generateTokens({
      userId: userData.userId,
      companyId: userData.companyId,
      email: userData.email,
      role: userData.role,
    });

    this.authTokenService.setRefreshTokenCookie(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }
}
