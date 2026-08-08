import { Test, TestingModule } from '@nestjs/testing';
import { NoticesService } from './notices.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NoticesService', () => {
  let service: NoticesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      notice: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NoticesService>(NoticesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create notice with default values', async () => {
      const mockCreated = { id: 'notice-1', title: 'Aviso Importante', type: 'Institucional' };
      prisma.notice.create.mockResolvedValue(mockCreated);

      const dto = {
        title: 'Aviso Importante',
        content: 'Conteúdo do aviso',
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
      expect(prisma.notice.create).toHaveBeenCalledWith({
        data: {
          title: 'Aviso Importante',
          summary: null,
          content: 'Conteúdo do aviso',
          type: 'Institucional',
          tags: [],
          coverImage: null,
          active: true,
        },
      });
    });
  });

  describe('findAll and findPublished', () => {
    it('should return all notices for admin', async () => {
      const mockList = [{ id: 'n1' }, { id: 'n2' }];
      prisma.notice.findMany.mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.notice.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return only published/active notices for public portal', async () => {
      const mockPublished = [{ id: 'n1', active: true }];
      prisma.notice.findMany.mockResolvedValue(mockPublished);

      const result = await service.findPublished();
      expect(result).toEqual(mockPublished);
      expect(prisma.notice.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return notice when found', async () => {
      const mockNotice = { id: 'n1', title: 'Notícia 1' };
      prisma.notice.findUnique.mockResolvedValue(mockNotice);

      const result = await service.findOne('n1');
      expect(result).toEqual(mockNotice);
    });

    it('should throw NotFoundException when notice is not found', async () => {
      prisma.notice.findUnique.mockResolvedValue(null);
      await expect(service.findOne('n-invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update notice if it exists', async () => {
      prisma.notice.findUnique.mockResolvedValue({ id: 'n1', title: 'Old' });
      prisma.notice.update.mockResolvedValue({ id: 'n1', title: 'New' });

      const result = await service.update('n1', { title: 'New' });
      expect(result.title).toBe('New');
      expect(prisma.notice.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: { title: 'New' },
      });
    });
  });

  describe('remove', () => {
    it('should delete notice if it exists', async () => {
      prisma.notice.findUnique.mockResolvedValue({ id: 'n1' });
      prisma.notice.delete.mockResolvedValue({ id: 'n1' });

      const result = await service.remove('n1');
      expect(result).toEqual({ id: 'n1' });
      expect(prisma.notice.delete).toHaveBeenCalledWith({ where: { id: 'n1' } });
    });
  });
});
