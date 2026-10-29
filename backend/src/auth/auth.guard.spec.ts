/// <reference types="jest" />
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

const COOKIE =
  process.env.NODE_ENV === 'production'
    ? '__Host-assec_session'
    : 'assec_session';

function buildContext(request: Record<string, unknown>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: { verify: jest.Mock };
  let usersService: { findById: jest.Mock };

  beforeEach(() => {
    jwtService = { verify: jest.fn() };
    usersService = { findById: jest.fn() };
    guard = new AuthGuard(jwtService as any, usersService as any);
  });

  it('rejects requests without a session cookie', async () => {
    const req = { cookies: {}, headers: {} };
    await expect(guard.canActivate(buildContext(req))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('ignores the Authorization: Bearer header (cookie is the only credential)', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'u1',
      email: 'a@a.com',
      role: 'ADMIN',
    });
    const req = {
      cookies: {},
      headers: { authorization: 'Bearer some.jwt.token' },
    };

    await expect(guard.canActivate(buildContext(req))).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verify).not.toHaveBeenCalled();
  });

  it('pins the JWT algorithm to HS256', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'u1',
      email: 'a@a.com',
      role: 'USER',
    });
    usersService.findById.mockResolvedValue({
      status: 'Ativo',
      role: 'USER',
      email: 'a@a.com',
    });
    const req = { cookies: { [COOKIE]: 'tok' }, headers: {} };

    await guard.canActivate(buildContext(req));

    expect(jwtService.verify).toHaveBeenCalledWith('tok', {
      algorithms: ['HS256'],
    });
  });

  it('takes the role from the DATABASE, not from the JWT payload', async () => {
    // Token still says ADMIN, but the user was demoted to USER in the database
    jwtService.verify.mockReturnValue({
      sub: 'u1',
      email: 'old@a.com',
      role: 'ADMIN',
    });
    usersService.findById.mockResolvedValue({
      status: 'Ativo',
      role: 'USER',
      email: 'a@a.com',
    });
    const req: any = { cookies: { [COOKIE]: 'tok' }, headers: {} };

    await guard.canActivate(buildContext(req));

    expect(req.user).toEqual({ sub: 'u1', email: 'a@a.com', role: 'USER' });
  });

  it('rejects suspended accounts', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'u1',
      email: 'a@a.com',
      role: 'USER',
    });
    usersService.findById.mockResolvedValue({
      status: 'Suspenso',
      role: 'USER',
      email: 'a@a.com',
    });
    const req = { cookies: { [COOKIE]: 'tok' }, headers: {} };

    await expect(guard.canActivate(buildContext(req))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects when the user no longer exists', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'gone',
      email: 'a@a.com',
      role: 'USER',
    });
    usersService.findById.mockResolvedValue(null);
    const req = { cookies: { [COOKIE]: 'tok' }, headers: {} };

    await expect(guard.canActivate(buildContext(req))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects an invalid or expired token', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('jwt expired');
    });
    const req = { cookies: { [COOKIE]: 'tok' }, headers: {} };

    await expect(guard.canActivate(buildContext(req))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a token whose tokenVersion no longer matches the database (session revoked)', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'u1',
      email: 'a@a.com',
      role: 'USER',
      tokenVersion: 1,
    });
    usersService.findById.mockResolvedValue({
      status: 'Ativo',
      role: 'USER',
      email: 'a@a.com',
      tokenVersion: 2,
    });
    const req = { cookies: { [COOKIE]: 'tok' }, headers: {} };

    await expect(guard.canActivate(buildContext(req))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
