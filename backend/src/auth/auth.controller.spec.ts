/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { type AuthenticatedRequest } from './auth.types';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { LoginThrottleService } from './login-throttle.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    validateUser: jest.Mock;
    login: jest.Mock;
  };

  const authServiceMock = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const usersServiceMock = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockUser = {
    id: 'user-uuid-1',
    email: 'dan@gmail.com',
    password: 'hashed-password',
    name: 'Dan',
    role: 'USER' as const,
    cpf: null,
    rg: null,
    matricula: null,
    status: 'Ativo',
    org: null,
    since: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    role: mockUser.role,
    cpf: mockUser.cpf,
    rg: mockUser.rg,
    matricula: mockUser.matricula,
    status: mockUser.status,
    org: mockUser.org,
    since: mockUser.since,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        LoginThrottleService,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = authServiceMock;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should NOT expose a public register endpoint', () => {
    expect((controller as any).register).toBeUndefined();
  });

  describe('login', () => {
    it('should return login result when credentials are valid and set cookie', async () => {
      const loginDto = { email: 'dan@gmail.com', password: 'daniel@123' };
      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      authService.validateUser.mockResolvedValue(mockUserWithoutPassword);
      authService.login.mockReturnValue({
        access_token: 'jwt-token',
        user: mockUserWithoutPassword,
      });

      const result = await controller.login(loginDto, mockResponse, {
        ip: '127.0.0.1',
      } as any);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'dan@gmail.com',
        'daniel@123',
      );
      const expectedCookieName =
        process.env.NODE_ENV === 'production'
          ? '__Host-assec_session'
          : 'assec_session';
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        expectedCookieName,
        'jwt-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
      expect(result).toEqual({
        user: expect.objectContaining({
          id: mockUserWithoutPassword.id,
          name: mockUserWithoutPassword.name,
          email: mockUserWithoutPassword.email,
          role: mockUserWithoutPassword.role,
        }),
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto = { email: 'dan@gmail.com', password: 'wrong' };
      const mockResponse = {} as any;

      authService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login(loginDto, mockResponse, { ip: '10.0.0.1' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return the SAME generic error for suspended accounts (no enumeration)', async () => {
      // validateUser returns null for unknown e-mail, wrong password AND suspended accounts
      authService.validateUser.mockResolvedValue(null);
      const req = { ip: '10.0.0.2' } as any;

      const errors: string[] = [];
      for (const email of ['unknown@test.com', 'suspended@test.com']) {
        try {
          await controller.login(
            { email, password: 'whatever' },
            {} as any,
            req,
          );
        } catch (e) {
          errors.push((e as UnauthorizedException).message);
        }
      }

      expect(errors).toHaveLength(2);
      expect(errors[0]).toBe(errors[1]);
    });

    it('should lock the account with 429 after repeated failures', async () => {
      authService.validateUser.mockResolvedValue(null);
      const req = { ip: '10.0.0.3' } as any;
      const dto = { email: 'victim@test.com', password: 'bad-guess' };

      for (let i = 0; i < 8; i++) {
        await expect(controller.login(dto, {} as any, req)).rejects.toThrow(
          UnauthorizedException,
        );
      }

      // 9th attempt is blocked BEFORE any password check
      authService.validateUser.mockClear();
      await expect(controller.login(dto, {} as any, req)).rejects.toMatchObject(
        {
          status: 429,
        },
      );
      expect(authService.validateUser).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear the session cookie and return success', async () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as any;

      const result = await controller.logout(mockResponse);

      const expectedCookieName =
        process.env.NODE_ENV === 'production'
          ? '__Host-assec_session'
          : 'assec_session';
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        expectedCookieName,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
      expect(result).toEqual({
        success: true,
        message: 'Sessão encerrada com sucesso.',
      });
    });
  });

  describe('getCsrfToken', () => {
    it('should set csrf cookie and return token', () => {
      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = controller.getCsrfToken(mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'assec_csrf',
        expect.any(String),
        expect.objectContaining({
          httpOnly: false,
          sameSite: 'lax',
          path: '/',
        }),
      );
      expect(result).toHaveProperty('csrfToken');
      expect(typeof result.csrfToken).toBe('string');
    });
  });

  describe('getProfile', () => {
    it('should return user from request', async () => {
      const req = {
        user: { sub: 'user-uuid-1', email: 'dan@gmail.com', role: 'USER' },
      } as AuthenticatedRequest;

      const mockProfile = {
        id: 'user-uuid-1',
        email: 'dan@gmail.com',
        name: 'Dan',
        role: 'USER',
      };
      usersServiceMock.findById.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(req);

      expect(usersServiceMock.findById).toHaveBeenCalledWith('user-uuid-1');
      expect(result).toEqual(mockProfile);
    });
  });
});
