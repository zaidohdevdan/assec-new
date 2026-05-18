// backend/src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  validate(payload: { sub: string; email: string; role: string }) {
    // ✅ Mapear payload.sub → user.id para uso consistente
    return {
      id: payload.sub, // ← Este é o campo que o controller vai usar
      email: payload.email,
      role: payload.role,
    };
  }
}
