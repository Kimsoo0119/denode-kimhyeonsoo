import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@api/auth/controllers/auth.controller';
import { AuthService } from '@api/auth/services/auth.service';
import { User, Company } from '@entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
