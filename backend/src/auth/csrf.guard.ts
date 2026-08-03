import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

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
 * Safe methods (GET, HEAD, OPTIONS) are skipped.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Safe methods don't change state — skip CSRF check
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
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
