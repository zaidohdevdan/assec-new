import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: any;

  beforeEach(async () => {
    service = {
      findAllForUser: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list notifications for current user', async () => {
    const mockList = [{ id: 'n1', title: 'Notif 1' }];
    service.findAllForUser.mockResolvedValue(mockList);

    const req: any = { user: { sub: 'user-1' } };
    const result = await controller.findAll(req);

    expect(result).toEqual(mockList);
    expect(service.findAllForUser).toHaveBeenCalledWith('user-1');
  });

  it('should mark single notification as read', async () => {
    service.markAsRead.mockResolvedValue({ id: 'n1', read: true });

    const req: any = { user: { sub: 'user-1' } };
    const result = await controller.markAsRead('n1', req);

    expect(result.read).toBe(true);
    expect(service.markAsRead).toHaveBeenCalledWith('n1', 'user-1');
  });

  it('should mark all notifications as read', async () => {
    service.markAllAsRead.mockResolvedValue({ count: 5 });

    const req: any = { user: { sub: 'user-1' } };
    const result = await controller.markAllAsRead(req);

    expect(result).toEqual({ count: 5 });
    expect(service.markAllAsRead).toHaveBeenCalledWith('user-1');
  });
});
