import { Module, forwardRef } from '@nestjs/common';
import type { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { LoginThrottleService } from './login-throttle.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        // Default must match the 1h session cookie lifetime (auth.controller.ts)
        const expiresIn = (config.get<string>('JWT_EXPIRES_IN') ||
          '1h') as StringValue;
        return { secret, signOptions: { expiresIn, algorithm: 'HS256' } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard, LoginThrottleService],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
