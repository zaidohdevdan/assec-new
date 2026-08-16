import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      pageVisit: {
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should ignore web crawlers / bots', () => {
    const result = service.recordVisit({
      path: '/noticias',
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    });

    expect(result).toEqual({ ok: true, ignored: true });
  });

  it('should record visit and flush to database', async () => {
    const result = service.recordVisit({
      path: '/convenios',
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      userId: 'user-123',
    });

    expect(result).toEqual({ ok: true });

    await service.flushBuffer();

    expect(prisma.pageVisit.createMany).toHaveBeenCalledTimes(1);
    const callArgs = prisma.pageVisit.createMany.mock.calls[0][0];
    expect(callArgs.data).toHaveLength(1);
    expect(callArgs.data[0].path).toBe('/convenios');
    expect(callArgs.data[0].isLogged).toBe(true);
    expect(callArgs.data[0].userId).toBe('user-123');
    // Ensure raw IP is NOT stored (ipHash is SHA-256)
    expect(callArgs.data[0].ipHash).toBeDefined();
    expect(callArgs.data[0].ipHash).not.toContain('192.168.1.1');
  });

  it('should calculate stats for admin correctly', async () => {
    const mockVisits = [
      {
        path: '/noticias',
        isLogged: true,
        userId: 'user-1',
        ipHash: 'hash-a',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        createdAt: new Date(),
      },
      {
        path: '/noticias',
        isLogged: false,
        userId: null,
        ipHash: 'hash-b',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        createdAt: new Date(),
      },
      {
        path: '/convenios',
        isLogged: false,
        userId: null,
        ipHash: 'hash-c',
        userAgent: 'Mozilla/5.0 (Linux; Android 13)',
        createdAt: new Date(),
      },
    ];

    prisma.pageVisit.findMany.mockResolvedValue(mockVisits);

    const stats = await service.getStats('7d');

    expect(stats.totalVisits).toBe(3);
    expect(stats.loggedVisits).toBe(1);
    expect(stats.anonymousVisits).toBe(2);
    expect(stats.uniqueVisitorsEstimate).toBe(3);
    expect(stats.uniqueLoggedUsers).toBe(1);
    expect(stats.topPages[0].path).toBe('/noticias');
    expect(stats.topPages[0].total).toBe(2);
    expect(stats.deviceBreakdown.mobile).toBe(2);
    expect(stats.deviceBreakdown.desktop).toBe(1);
  });
});
