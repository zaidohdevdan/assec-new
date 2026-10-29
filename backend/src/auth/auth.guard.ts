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

interface CachedAccount {
  status: string;
  role: string;
  email: string;
  tokenVersion?: number;
  expiresAt: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private static accountCache = new Map<string, CachedAccount>();
  private readonly CACHE_TTL_MS = 30_000; // 30 seconds

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    AuthGuard.accountCache.clear();
  }

  /**
   * Immediately evicts a user's cached account entry (or the entire cache)
   * when their session, password, role, or status changes.
   */
  static evictAccountCache(userId?: string): void {
    if (userId) {
      AuthGuard.accountCache.delete(userId);
    } else {
      AuthGuard.accountCache.clear();
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<
        AuthenticatedRequest & { cookies?: Record<string, string> }
      >();

    // 1. Extract the JWT from the HttpOnly session cookie only.
    //    The Authorization: Bearer fallback was removed on purpose: it bypassed
    //    the cookie + CSRF (double-submit) model and no client used it.
    const token = request.cookies?.[SESSION_COOKIE];

    if (!token) {
      throw new UnauthorizedException(
        'Sessão não encontrada. Faça login novamente.',
      );
    }

    // 2. Verify JWT signature and expiry (algorithm pinned, never derived from the token)
    let payload: {
      sub: string;
      email: string;
      role: string;
      tokenVersion?: number;
    };
    try {
      payload = this.jwtService.verify(token, { algorithms: ['HS256'] });
    } catch {
      throw new UnauthorizedException('Token de sessão inválido ou expirado.');
    }

    // 3. Load the CURRENT account state (status + role + tokenVersion) from the database.
    //    Uses a 30s in-memory cache to avoid a query on every HTTP request.
    //    The role is NEVER trusted from the JWT: a demoted or suspended user
    //    loses access within the cache TTL instead of keeping it until the
    //    token expires.
    const account = await this.getAccountCached(payload.sub);
    if (!account) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    if (account.status !== 'Ativo') {
      throw new UnauthorizedException(
        'Conta suspensa ou inativa. Entre em contato com o administrador.',
      );
    }

    // 4. Verify server-side session version (revoked on logout or password change)
    if (
      payload.tokenVersion !== undefined &&
      account.tokenVersion !== undefined &&
      payload.tokenVersion !== account.tokenVersion
    ) {
      throw new UnauthorizedException(
        'Sessão encerrada ou revogada. Faça login novamente.',
      );
    }

    // 5. Attach the verified identity (role from the database) to the request
    request.user = {
      sub: payload.sub,
      email: account.email,
      role: account.role,
    };
    return true;
  }

  private async getAccountCached(
    userId: string,
  ): Promise<CachedAccount | null> {
    const now = Date.now();
    const cached = AuthGuard.accountCache.get(userId);

    if (cached && cached.expiresAt > now) {
      return cached;
    }

    const dbUser = await this.usersService.findById(userId);
    if (!dbUser) {
      AuthGuard.accountCache.delete(userId);
      return null;
    }

    const entry: CachedAccount = {
      status: dbUser.status,
      role: dbUser.role,
      email: dbUser.email,
      tokenVersion: (dbUser as { tokenVersion?: number }).tokenVersion,
      expiresAt: now + this.CACHE_TTL_MS,
    };
    AuthGuard.accountCache.set(userId, entry);

    return entry;
  }
}
