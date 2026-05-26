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
    it('should return login result when credentials are valid', async () => {
      const loginDto = { email: 'dan@gmail.com', password: 'daniel@123' };

      authService.validateUser.mockResolvedValue(mockUserWithoutPassword);
      authService.login.mockReturnValue({
        access_token: 'jwt-token',
        user: mockUserWithoutPassword,
      });

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'dan@gmail.com',
        'daniel@123',
      );
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUserWithoutPassword,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto = { email: 'dan@gmail.com', password: 'wrong' };

      authService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
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
