import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [JwtModule.register({ global: true }), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
