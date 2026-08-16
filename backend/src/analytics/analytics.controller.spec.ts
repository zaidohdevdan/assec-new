import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: any;
  let jwtService: any;

  beforeEach(async () => {
    service = {
      recordVisit: jest.fn().mockReturnValue({ ok: true }),
      getStats: jest.fn().mockResolvedValue({ totalVisits: 10 }),
    };

    jwtService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: service },
        { provide: JwtService, useValue: jwtService },
        { provide: UsersService, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should record visit for anonymous visitor', async () => {
    const req: any = {
      headers: { 'user-agent': 'TestAgent' },
      socket: { remoteAddress: '127.0.0.1' },
      cookies: {},
    };

    const res = await controller.recordVisit({ path: '/home' }, req);
    expect(res).toEqual({ ok: true });
    expect(service.recordVisit).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/home',
        userId: null,
      }),
    );
  });

  it('should record visit for logged in user', async () => {
    jwtService.verify.mockReturnValue({ sub: 'user-abc' });

    const req: any = {
      headers: { 'user-agent': 'TestAgent' },
      socket: { remoteAddress: '127.0.0.1' },
      cookies: { assec_session: 'valid-token' },
    };

    const res = await controller.recordVisit({ path: '/portal' }, req);
    expect(res).toEqual({ ok: true });
    expect(service.recordVisit).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/portal',
        userId: 'user-abc',
      }),
    );
  });

  it('should return admin stats', async () => {
    const res = await controller.getStats('30d');
    expect(res).toEqual({ totalVisits: 10 });
    expect(service.getStats).toHaveBeenCalledWith('30d');
  });
});
