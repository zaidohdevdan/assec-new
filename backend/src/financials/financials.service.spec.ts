import { Test, TestingModule } from '@nestjs/testing';
import { FinancialsService } from './financials.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('FinancialsService', () => {
  let service: FinancialsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
      financialRecord: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        groupBy: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<FinancialsService>(FinancialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a financial record', async () => {
      const mockCreated = { id: 'f1', description: 'Mensalidade', amount: 150.0, type: 'INCOME' };
      prisma.financialRecord.create.mockResolvedValue(mockCreated);

      const dto = { description: 'Mensalidade', amount: 150.0, type: 'INCOME', category: 'Mensalidades', date: new Date() } as any;
      const result = await service.create(dto);

      expect(result).toEqual(mockCreated);
      expect(prisma.financialRecord.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return records ordered by date desc', async () => {
      const mockList = [{ id: 'f1' }, { id: 'f2' }];
      prisma.financialRecord.findMany.mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.financialRecord.findMany).toHaveBeenCalledWith({
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return record when found', async () => {
      const mockRec = { id: 'f1', description: 'Conta de Luz' };
      prisma.financialRecord.findUnique.mockResolvedValue(mockRec);

      const result = await service.findOne('f1');
      expect(result).toEqual(mockRec);
    });

    it('should throw NotFoundException when record not found', async () => {
      prisma.financialRecord.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats with database-level aggregations', () => {
    it('should compute totals and monthly breakdown using database groupBy and aggregations', async () => {
      prisma.financialRecord.groupBy.mockResolvedValue([
        { type: 'INCOME', _sum: { amount: 50000.0 } },
        { type: 'EXPENSE', _sum: { amount: 20000.0 } },
      ]);

      prisma.$queryRaw.mockResolvedValue([
        {
          month_key: '2026-08',
          month_num: 8,
          year_num: 2026,
          income: 50000.0,
          expense: 20000.0,
        },
      ]);

      const stats = await service.getStats();

      expect(stats.totalIncome).toBe(50000.0);
      expect(stats.totalExpense).toBe(20000.0);
      expect(stats.balance).toBe(30000.0);
      expect(stats.monthly).toEqual([
        {
          month: 'Ago/2026',
          income: 50000.0,
          expense: 20000.0,
        },
      ]);
      expect(prisma.financialRecord.groupBy).toHaveBeenCalledWith({
        by: ['type'],
        _sum: { amount: true },
      });
    });
  });

  describe('update and remove', () => {
    it('should update record when found', async () => {
      prisma.financialRecord.findUnique.mockResolvedValue({ id: 'f1', description: 'Old' });
      prisma.financialRecord.update.mockResolvedValue({ id: 'f1', description: 'New' });

      const result = await service.update('f1', { description: 'New' } as any);
      expect(result.description).toBe('New');
    });

    it('should delete record when found', async () => {
      prisma.financialRecord.findUnique.mockResolvedValue({ id: 'f1' });
      prisma.financialRecord.delete.mockResolvedValue({ id: 'f1' });

      const result = await service.remove('f1');
      expect(result).toEqual({ id: 'f1' });
    });
  });
});
