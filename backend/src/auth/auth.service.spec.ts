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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
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
        role: 'USER',
        cpf: null,
        rg: null,
        matricula: null,
        status: 'Ativo',
        org: null,
        since: mockUser.since,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
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
  });

  describe('login', () => {
    it('should return access_token and user', () => {
      const { password, ...userWithoutPassword } = mockUser;

      (jwtService.sign as jest.Mock).mockReturnValue('jwt-token-123');

      const result = service.login(userWithoutPassword);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'dan@gmail.com',
        sub: 'user-uuid-1',
        role: 'USER',
      });
      expect(result).toEqual({
        access_token: 'jwt-token-123',
        user: userWithoutPassword,
      });
    });
  });
});
