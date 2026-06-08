/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { type AuthenticatedRequest } from './auth.types';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    validateUser: jest.Mock;
    login: jest.Mock;
    register: jest.Mock;
  };

  const authServiceMock = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
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

  describe('register', () => {
    it('should create a user and return login result', async () => {
      const registerDto = {
        email: 'dan@gmail.com',
        password: 'daniel@123',
        name: 'Dan',
      };

      authService.register.mockResolvedValue({
        access_token: 'jwt-token',
        user: mockUserWithoutPassword,
      });

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUserWithoutPassword,
      });
    });
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

      const result = await controller.login(loginDto, mockResponse);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'dan@gmail.com',
        'daniel@123',
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        '__Host-assec_session',
        'jwt-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
      expect(result).toEqual({
        access_token: 'jwt-token',
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

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when account is suspended/inactive', async () => {
      const loginDto = { email: 'dan@gmail.com', password: 'daniel@123' };
      const mockResponse = {} as any;

      authService.validateUser.mockResolvedValue('BLOCKED');

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        new UnauthorizedException(
          'Conta suspensa ou inativa. Entre em contato com o administrador.',
        ),
      );
    });
  });

  describe('logout', () => {
    it('should clear the session cookie and return success', async () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as any;

      const result = await controller.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        '__Host-assec_session',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        }),
      );
      expect(result).toEqual({ success: true, message: 'Sessão encerrada com sucesso.' });
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
