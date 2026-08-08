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
    //    Uses a 30s in-memory cache to eliminate repetitive DB queries on every HTTP request.
    const status = await this.getUserStatusCached(payload.sub);
    if (!status) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    if (status !== 'Ativo') {
      throw new UnauthorizedException(
        'Conta suspensa ou inativa. Entre em contato com o administrador.',
      );
    }

    // 4. Attach verified payload to the request object for use by controllers
    request.user = payload;
    return true;
  }

  private statusCache = new Map<string, { status: string; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 30_000; // 30 seconds

  private async getUserStatusCached(userId: string): Promise<string | null> {
    const now = Date.now();
    const cached = this.statusCache.get(userId);

    if (cached && cached.expiresAt > now) {
      return cached.status;
    }

    const dbUser = await this.usersService.findById(userId);
    if (!dbUser) {
      this.statusCache.delete(userId);
      return null;
    }

    this.statusCache.set(userId, {
      status: dbUser.status,
      expiresAt: now + this.CACHE_TTL_MS,
    });

    return dbUser.status;
  }
}
