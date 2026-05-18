import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // ← Importar

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy'; // ← Importar strategy

@Module({
  imports: [
    UsersModule,
    PassportModule, // ← Registrar módulo do Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // ← Registrar strategy
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
