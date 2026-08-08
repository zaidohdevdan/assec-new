import { Test, TestingModule } from '@nestjs/testing';
import { SlotsService } from './slots.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('SlotsService', () => {
  let service: SlotsService;
  let prisma: any;
  let notifications: any;

  beforeEach(async () => {
    prisma = {
      scheduleSlot: {
        create: jest.fn(),
        createMany: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      schedule: {
        update: jest.fn(),
      },
    };

    notifications = {
      create: jest.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();

    service = module.get<SlotsService>(SlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll with type filter', () => {
    it('should query slots with date >= today and status Disponivel', async () => {
      const mockSlots = [{ id: 'slot-1', date: '2026-09-10', time: '10:00', status: 'Disponível' }];
      prisma.scheduleSlot.findMany.mockResolvedValue(mockSlots);

      const result = await service.findAll({ type: 'Assistência Jurídica' });

      expect(result).toEqual(mockSlots);
      expect(prisma.scheduleSlot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'Disponível',
            professional: { specialty: 'Assistência Jurídica' },
          }),
        }),
      );
    });
  });

  describe('findAll with professionalId filter', () => {
    it('should dynamically map past slots to Expirado or Realizado', async () => {
      const mockSlots = [
        { id: 'past-1', date: '2020-01-01', time: '09:00', status: 'Disponível' },
        { id: 'past-2', date: '2020-01-01', time: '10:00', status: 'Reservado' },
        { id: 'future-1', date: '2099-01-01', time: '10:00', status: 'Disponível' },
      ];
      prisma.scheduleSlot.findMany.mockResolvedValue(mockSlots);

      const result = await service.findAll({ professionalId: 'prof-1' });

      expect(result[0].status).toBe('Expirado');
      expect(result[1].status).toBe('Realizado');
      expect(result[2].status).toBe('Disponível');
    });
  });

  describe('createBatch', () => {
    it('should create multiple slots for professional', async () => {
      prisma.scheduleSlot.createMany.mockResolvedValue({ count: 2 });

      const result = await service.createBatch('prof-1', [
        { date: '2026-09-10', time: '09:00' },
        { date: '2026-09-10', time: '10:00' },
      ]);

      expect(prisma.scheduleSlot.createMany).toHaveBeenCalledWith({
        data: [
          { professionalId: 'prof-1', date: '2026-09-10', time: '09:00', status: 'Disponível' },
          { professionalId: 'prof-1', date: '2026-09-10', time: '10:00', status: 'Disponível' },
        ],
      });
      expect(result).toEqual({ count: 2 });
    });
  });

  describe('remove', () => {
    it('should delete slot and notify associate if slot was booked', async () => {
      const mockSlot = {
        id: 'slot-1',
        professionalId: 'prof-1',
        date: '2026-09-10',
        time: '09:00',
        professional: { name: 'Dr. Marcos', specialty: 'Jurídico' },
        schedule: {
          id: 'sched-1',
          userId: 'user-1',
          user: { name: 'Associado' },
        },
      };

      prisma.scheduleSlot.findUnique.mockResolvedValue(mockSlot);
      prisma.scheduleSlot.delete.mockResolvedValue(mockSlot);

      await service.remove('slot-1', 'prof-1');

      expect(prisma.schedule.update).toHaveBeenCalledWith({
        where: { id: 'sched-1' },
        data: { status: 'Cancelado', slot: { disconnect: true } },
      });
      expect(notifications.create).toHaveBeenCalled();
      expect(prisma.scheduleSlot.delete).toHaveBeenCalledWith({ where: { id: 'slot-1' } });
    });
  });
});
