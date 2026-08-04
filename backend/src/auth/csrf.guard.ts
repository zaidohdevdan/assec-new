import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Decorator to skip CSRF validation on specific endpoints.
 * Use on pre-auth endpoints like login, register, and public contact form.
 *
 * @example
 * @SkipCsrf()
 * @Post('login')
 * async login() { ... }
 */
export const SKIP_CSRF_KEY = 'skipCsrf';
export const SkipCsrf = () => SetMetadata(SKIP_CSRF_KEY, true);

/**
 * CsrfGuard implements the double-submit cookie pattern.
 *
 * How it works:
 * 1. The client calls GET /auth/csrf to receive a CSRF token (set as a
 *    non-HttpOnly cookie `assec_csrf` and returned in the response body).
 * 2. For every state-changing request (POST/PUT/PATCH/DELETE), the client
 *    must include the token in the `X-CSRF-Token` header.
 * 3. This guard compares the header value against the cookie value.
 *
 * Safe methods (GET, HEAD, OPTIONS) are skipped automatically.
 * Endpoints decorated with @SkipCsrf() are also skipped.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Safe methods don't change state — skip CSRF check
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    // Skip if endpoint is decorated with @SkipCsrf()
    const skipCsrf = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipCsrf) {
      return true;
    }

    const cookieToken = request.cookies?.['assec_csrf'];
    const headerToken = request.headers['x-csrf-token'];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new ForbiddenException(
        'Token CSRF inválido ou ausente. Recarregue a página e tente novamente.',
      );
    }

    return true;
  }
}
