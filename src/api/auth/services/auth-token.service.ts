import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload, Tokens } from '../interfaces/interface';

@Injectable()
export class AuthTokenService {
  private jwtAccessTokenSecretKey: string;
  private jwtRefreshTokenSecretKey: string;
  private jwtAccessTokenExpiresIn: string;
  private jwtRefreshTokenExpiresIn: string;
  private jwtRefreshTokenTtl: number;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessTokenSecretKey = this.configService.get(
      'JWT_ACCESS_TOKEN_SECRET_KEY',
    );
    this.jwtRefreshTokenSecretKey = this.configService.get(
      'JWT_REFRESH_TOKEN_SECRET_KEY',
    );
    this.jwtAccessTokenExpiresIn = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );
    this.jwtRefreshTokenExpiresIn = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
    this.jwtRefreshTokenTtl = this.configService.get('JWT_REFRESH_TOKEN_TTL');
  }

  async generateTokens(payload: TokenPayload): Promise<Tokens> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtAccessTokenSecretKey,
      expiresIn: this.jwtAccessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshTokenSecretKey,
      expiresIn: this.jwtRefreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: this.jwtRefreshTokenTtl,
      path: '/',
    });
  }
}
