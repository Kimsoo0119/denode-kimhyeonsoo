import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@api/auth/controllers/auth.controller';
import { AuthService } from '@api/auth/services/auth.service';
import { AuthTokenService } from '@api/auth/services/auth-token.service';
import { User, Company } from '@entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService],
})
export class AuthModule {}
