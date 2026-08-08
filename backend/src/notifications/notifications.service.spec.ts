import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create notification for given user', async () => {
      const mockCreated = { id: 'notif-1', userId: 'user-1', title: 'Aviso', content: 'Msg' };
      prisma.notification.create.mockResolvedValue(mockCreated);

      const result = await service.create('user-1', 'Aviso', 'Msg');
      expect(result).toEqual(mockCreated);
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          title: 'Aviso',
          content: 'Msg',
        },
      });
    });
  });

  describe('findAllForUser', () => {
    it('should list notifications ordered by createdAt desc', async () => {
      const mockList = [{ id: 'n1' }, { id: 'n2' }];
      prisma.notification.findMany.mockResolvedValue(mockList);

      const result = await service.findAllForUser('user-1');
      expect(result).toEqual(mockList);
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read when owned by user', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: 'user-1',
        read: false,
      });
      prisma.notification.update.mockResolvedValue({
        id: 'n1',
        userId: 'user-1',
        read: true,
      });

      const result = await service.markAsRead('n1', 'user-1');
      expect(result.read).toBe(true);
      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'n1' },
        data: { read: true },
      });
    });

    it('should throw NotFoundException if notification does not exist', async () => {
      prisma.notification.findUnique.mockResolvedValue(null);
      await expect(service.markAsRead('invalid-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if notification belongs to another user', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: 'user-other',
      });
      await expect(service.markAsRead('n1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read for user', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead('user-1');
      expect(result).toEqual({ count: 3 });
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          read: false,
        },
        data: { read: true },
      });
    });
  });
});
