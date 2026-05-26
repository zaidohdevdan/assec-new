/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: jest.Mocked<PrismaService>;

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
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('dan@gmail.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'dan@gmail.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('unknown@test.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user without password by id', async () => {
      const userWithoutPassword = {
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
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithoutPassword);

      const result = await service.findById('user-uuid-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
          role: true,
        }),
      });
      expect(result).toEqual(userWithoutPassword);
    });
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create({
        email: 'dan@gmail.com',
        password: 'daniel@123',
        name: 'Dan',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('daniel@123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'dan@gmail.com',
          password: 'hashed-password',
          name: 'Dan',
        },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
