import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { type AuthenticatedRequest } from './auth.types';

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_COOKIE = isProduction ? '__Host-assec_session' : 'assec_session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<
        AuthenticatedRequest & { cookies?: Record<string, string> }
      >();

    // 1. Extract the JWT — prefer the HttpOnly cookie, fall back to Authorization header
    //    (Bearer header is kept for the Root Terminal which cannot use cookies directly)
    let token: string | undefined;

    const cookieToken = request.cookies?.[SESSION_COOKIE];
    if (cookieToken) {
      token = cookieToken;
    } else {
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException(
        'Sessão não encontrada. Faça login novamente.',
      );
    }

    // 2. Verify JWT signature and expiry
    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token de sessão inválido ou expirado.');
    }

    // 3. Feature: Account-status check — query the DB for the current status.
    //    This ensures that admin account suspension takes effect immediately,
    //    even for users who are already logged in with a valid JWT.
    // TODO(security): Add a short-TTL in-memory cache (e.g., 30s) here if latency becomes a concern.
    const dbUser = await this.usersService.findById(payload.sub);
    if (!dbUser) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    if (dbUser.status !== 'Ativo') {
      throw new UnauthorizedException(
        'Conta suspensa ou inativa. Entre em contato com o administrador.',
      );
    }

    // 4. Attach verified payload to the request object for use by controllers
    request.user = payload;
    return true;
  }
}
