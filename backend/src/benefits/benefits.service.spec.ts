import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsService } from './benefits.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BenefitsService', () => {
  let service: BenefitsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      benefit: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BenefitsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BenefitsService>(BenefitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a benefit', async () => {
      const mockCreated = { id: 'b1', title: 'Plano Odontológico' };
      prisma.benefit.create.mockResolvedValue(mockCreated);

      const dto = { title: 'Plano Odontológico', description: 'Cobertura completa' } as any;
      const result = await service.create(dto);

      expect(result).toEqual(mockCreated);
      expect(prisma.benefit.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll and findPublished', () => {
    it('should return all benefits for admin', async () => {
      const mockList = [{ id: 'b1' }, { id: 'b2' }];
      prisma.benefit.findMany.mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.benefit.findMany).toHaveBeenCalledWith({
        orderBy: { title: 'asc' },
      });
    });

    it('should return only published benefits for portal users', async () => {
      const mockList = [{ id: 'b1', active: true }];
      prisma.benefit.findMany.mockResolvedValue(mockList);

      const result = await service.findPublished();
      expect(result).toEqual(mockList);
      expect(prisma.benefit.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return benefit when found', async () => {
      const mockBenefit = { id: 'b1', title: 'Convênio Farmácia' };
      prisma.benefit.findUnique.mockResolvedValue(mockBenefit);

      const result = await service.findOne('b1');
      expect(result).toEqual(mockBenefit);
    });

    it('should throw NotFoundException when benefit not found', async () => {
      prisma.benefit.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update benefit when found', async () => {
      prisma.benefit.findUnique.mockResolvedValue({ id: 'b1', title: 'Old' });
      prisma.benefit.update.mockResolvedValue({ id: 'b1', title: 'New' });

      const result = await service.update('b1', { title: 'New' } as any);
      expect(result.title).toBe('New');
      expect(prisma.benefit.update).toHaveBeenCalledWith({
        where: { id: 'b1' },
        data: { title: 'New' },
      });
    });
  });

  describe('remove', () => {
    it('should delete benefit when found', async () => {
      prisma.benefit.findUnique.mockResolvedValue({ id: 'b1' });
      prisma.benefit.delete.mockResolvedValue({ id: 'b1' });

      const result = await service.remove('b1');
      expect(result).toEqual({ id: 'b1' });
      expect(prisma.benefit.delete).toHaveBeenCalledWith({ where: { id: 'b1' } });
    });
  });
});
