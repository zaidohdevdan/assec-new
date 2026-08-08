import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let prisma: any;
  let notifications: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(),
      schedule: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      scheduleSlot: {
        updateMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    notifications = {
      create: jest.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create schedule successfully inside atomic transaction', async () => {
      const mockSlot = {
        id: 'slot-1',
        date: '2026-09-10',
        time: '10:00',
        professionalId: 'prof-1',
        professional: { id: 'prof-1', specialty: 'Jurídico' },
      };

      const mockSchedule = {
        id: 'sched-1',
        title: 'Primeira Consulta',
        userId: 'user-1',
        slotId: 'slot-1',
        user: { name: 'Associado Teste' },
      };

      prisma.$transaction.mockImplementation(async (callback: any) => {
        const tx = {
          scheduleSlot: {
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            findUnique: jest.fn().mockResolvedValue(mockSlot),
          },
          schedule: {
            create: jest.fn().mockResolvedValue(mockSchedule),
          },
        };
        return callback(tx);
      });

      const result = await service.create({
        userId: 'user-1',
        slotId: 'slot-1',
        title: 'Primeira Consulta',
      });

      expect(result).toEqual(mockSchedule);
      expect(notifications.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if slot is already booked (count = 0)', async () => {
      prisma.$transaction.mockImplementation(async (callback: any) => {
        const tx = {
          scheduleSlot: {
            updateMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
        };
        return callback(tx);
      });

      await expect(
        service.create({
          userId: 'user-1',
          slotId: 'slot-1',
          title: 'Primeira Consulta',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByUser', () => {
    it('should return schedules for a given user', async () => {
      const mockList = [{ id: 'sched-1', title: 'Consulta 1' }];
      prisma.schedule.findMany.mockResolvedValue(mockList);

      const result = await service.findByUser('user-1');
      expect(result).toEqual(mockList);
      expect(prisma.schedule.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
    });
  });

  describe('update', () => {
    it('should release slot when appointment is cancelled', async () => {
      const mockSchedule = {
        id: 'sched-1',
        userId: 'user-1',
        slotId: 'slot-1',
        date: '2026-09-10',
        time: '10:00',
        user: { name: 'Associado Teste' },
        slot: {
          professionalId: 'prof-1',
          professional: { specialty: 'Jurídico' },
        },
      };

      prisma.schedule.findUnique.mockResolvedValue(mockSchedule);
      prisma.schedule.update.mockResolvedValue({ ...mockSchedule, status: 'Cancelado' });

      const result = await service.update('sched-1', 'user-1', { status: 'Cancelado' });

      expect(result.status).toBe('Cancelado');
      expect(prisma.scheduleSlot.update).toHaveBeenCalledWith({
        where: { id: 'slot-1' },
        data: { status: 'Disponível' },
      });
      expect(notifications.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own schedule', async () => {
      prisma.schedule.findUnique.mockResolvedValue({
        id: 'sched-1',
        userId: 'user-other',
      });

      await expect(
        service.update('sched-1', 'user-1', { status: 'Cancelado' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
