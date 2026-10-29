/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: { sign: jest.Mock; signAsync: jest.Mock };

  const mockUser = {
    id: 'user-uuid-1',
    email: 'dan@gmail.com',
    password: 'hashed-password',
    name: 'Dan',
    displayName: null,
    role: 'USER' as const,
    cpf: null,
    rg: null,
    matricula: null,
    status: 'Ativo' as const,
    org: null,
    since: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    photoUrl: null,
    avatarUrl: null,
    specialty: null,
    tokenVersion: 0,
    mustChangePassword: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            incrementTokenVersion: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('dan@gmail.com', 'daniel@123');

      expect(usersService.findByEmail).toHaveBeenCalledWith('dan@gmail.com');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'daniel@123',
        'hashed-password',
      );
      expect(result).toEqual({
        id: 'user-uuid-1',
        email: 'dan@gmail.com',
        name: 'Dan',
        displayName: null,
        role: 'USER',
        cpf: null,
        rg: null,
        matricula: null,
        status: 'Ativo',
        org: null,
        since: mockUser.since,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        photoUrl: null,
        avatarUrl: null,
        specialty: null,
        tokenVersion: 0,
        mustChangePassword: false,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('unknown@test.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is wrong', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'dan@gmail.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });

    it('should still run bcrypt when the user does not exist (constant-time login)', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockClear();
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await service.validateUser('ghost@test.com', 'any-password');

      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should return null (not a sentinel) for a suspended account with the correct password', async () => {
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        status: 'Suspenso',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('dan@gmail.com', 'daniel@123');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token and user with tokenVersion in payload', () => {
      const { password: _password, ...userWithoutPassword } = mockUser;
      void _password;

      jwtService.sign.mockReturnValue('jwt-token-123');

      const result = service.login(userWithoutPassword);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'dan@gmail.com',
        sub: 'user-uuid-1',
        role: 'USER',
        tokenVersion: 0,
      });
      expect(result).toEqual({
        access_token: 'jwt-token-123',
        user: userWithoutPassword,
      });
    });
  });

  describe('revokeTokenIfPresent', () => {
    it('increments tokenVersion when a valid token is passed', async () => {
      (jwtService as unknown as { verify: jest.Mock }).verify.mockReturnValue({
        sub: 'user-uuid-1',
      });

      const userId = await service.revokeTokenIfPresent('valid-jwt');

      expect(userId).toBe('user-uuid-1');
      expect(usersService.incrementTokenVersion).toHaveBeenCalledWith(
        'user-uuid-1',
      );
    });
  });
});
