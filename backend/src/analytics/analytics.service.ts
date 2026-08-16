import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface VisitBufferItem {
  path: string;
  userId?: string | null;
  isLogged: boolean;
  sessionId?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface AnalyticsStatsResponse {
  period: string;
  totalVisits: number;
  loggedVisits: number;
  anonymousVisits: number;
  uniqueVisitorsEstimate: number;
  uniqueLoggedUsers: number;
  timeline: Array<{
    date: string;
    logged: number;
    anonymous: number;
    total: number;
  }>;
  topPages: Array<{
    path: string;
    total: number;
    logged: number;
    anonymous: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
    other: number;
  };
}

@Injectable()
export class AnalyticsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsService.name);
  private visitBuffer: VisitBufferItem[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 50;
  private readonly FLUSH_INTERVAL_MS = 5000; // 5 seconds
  private isFlushing = false;
  private dailySalt = crypto.randomBytes(16).toString('hex');
  private lastSaltDate = new Date().toISOString().slice(0, 10);

  // Common bot regex pattern to filter out web crawlers and indexers
  private readonly botPattern =
    /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|facebookexternalhit|whatsapp|telegrambot|twitterbot/i;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.flushTimer = setInterval(() => {
      this.flushBuffer().catch((err) => {
        this.logger.error('Failed to flush analytics buffer on interval', err);
      });
    }, this.FLUSH_INTERVAL_MS);
  }

  async onModuleDestroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flushBuffer();
  }

  /**
   * Generates a privacy-compliant IP hash using SHA-256 and daily rotating salt.
   * Conforms to LGPD/GDPR: Cannot reverse-engineer user IP.
   */
  private generateIpHash(ip: string): string {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== this.lastSaltDate) {
      this.dailySalt = crypto.randomBytes(16).toString('hex');
      this.lastSaltDate = today;
    }
    return crypto
      .createHash('sha256')
      .update(`${ip || 'unknown'}-${this.dailySalt}-${today}`)
      .digest('hex');
  }

  /**
   * Sanitizes the URL path to avoid DB pollution or XSS injection.
   */
  private sanitizePath(rawPath?: string): string {
    if (!rawPath || typeof rawPath !== 'string') return '/';
    // Remove query params and hashes for page tracking grouping, trim, limit length
    let clean = rawPath.split('?')[0].split('#')[0].trim();
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean.slice(0, 255);
  }

  /**
   * Records a visit into the in-memory buffer.
   */
  recordVisit(params: {
    path?: string;
    sessionId?: string;
    ip?: string;
    userAgent?: string;
    userId?: string | null;
  }) {
    const ua = params.userAgent || '';
    if (this.botPattern.test(ua)) {
      return { ok: true, ignored: true };
    }

    const path = this.sanitizePath(params.path);
    const ipHash = this.generateIpHash(params.ip || '127.0.0.1');
    const isLogged = Boolean(params.userId);

    this.visitBuffer.push({
      path,
      userId: params.userId || null,
      isLogged,
      sessionId: params.sessionId ? String(params.sessionId).slice(0, 64) : null,
      ipHash,
      userAgent: ua ? ua.slice(0, 500) : null,
      createdAt: new Date(),
    });

    if (this.visitBuffer.length >= this.BATCH_SIZE) {
      this.flushBuffer().catch((err) => {
        this.logger.error('Failed to flush analytics buffer on batch threshold', err);
      });
    }

    return { ok: true };
  }

  /**
   * Flushes the in-memory visit buffer to PostgreSQL in a single batch insert.
   */
  async flushBuffer(): Promise<void> {
    if (this.isFlushing || this.visitBuffer.length === 0) return;

    this.isFlushing = true;
    const itemsToInsert = [...this.visitBuffer];
    this.visitBuffer = [];

    try {
      await this.prisma.pageVisit.createMany({
        data: itemsToInsert,
      });
    } catch (error) {
      this.logger.error(
        `Failed to batch insert ${itemsToInsert.length} analytics records`,
        error,
      );
      // Put records back in front of buffer (preserving order) if bounded
      if (this.visitBuffer.length < 500) {
        this.visitBuffer = [...itemsToInsert, ...this.visitBuffer];
      }
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Retrieves aggregated analytics stats for admin reporting.
   */
  async getStats(period: string = '30d'): Promise<AnalyticsStatsResponse> {
    // Flush current in-memory buffer first so reports include the latest visits
    await this.flushBuffer();

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const visits = await this.prisma.pageVisit.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        path: true,
        isLogged: true,
        userId: true,
        ipHash: true,
        userAgent: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    let loggedVisits = 0;
    let anonymousVisits = 0;
    const uniqueIps = new Set<string>();
    const uniqueUsers = new Set<string>();
    const pageMap = new Map<
      string,
      { total: number; logged: number; anonymous: number }
    >();
    const dailyMap = new Map<
      string,
      { logged: number; anonymous: number; total: number }
    >();
    const devices = { mobile: 0, desktop: 0, tablet: 0, other: 0 };

    for (const v of visits) {
      if (v.isLogged) {
        loggedVisits++;
        if (v.userId) uniqueUsers.add(v.userId);
      } else {
        anonymousVisits++;
      }

      if (v.ipHash) uniqueIps.add(v.ipHash);

      // Page stats
      const currentPath = v.path || '/';
      const pageEntry = pageMap.get(currentPath) || {
        total: 0,
        logged: 0,
        anonymous: 0,
      };
      pageEntry.total++;
      if (v.isLogged) pageEntry.logged++;
      else pageEntry.anonymous++;
      pageMap.set(currentPath, pageEntry);

      // Timeline breakdown (by date YYYY-MM-DD)
      const dayKey = v.createdAt.toISOString().slice(0, 10);
      const dayEntry = dailyMap.get(dayKey) || {
        logged: 0,
        anonymous: 0,
        total: 0,
      };
      dayEntry.total++;
      if (v.isLogged) dayEntry.logged++;
      else dayEntry.anonymous++;
      dailyMap.set(dayKey, dayEntry);

      // Device detection
      const ua = (v.userAgent || '').toLowerCase();
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        devices.tablet++;
      } else if (/mobile|iphone|android|phone|ipod/i.test(ua)) {
        devices.mobile++;
      } else if (/windows|macintosh|linux|cros/i.test(ua)) {
        devices.desktop++;
      } else {
        devices.other++;
      }
    }

    // Sort Top Pages
    const topPages = Array.from(pageMap.entries())
      .map(([path, data]) => ({
        path,
        total: data.total,
        logged: data.logged,
        anonymous: data.anonymous,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Build chronological timeline including days with 0 visits if within range
    const timeline: Array<{
      date: string;
      logged: number;
      anonymous: number;
      total: number;
    }> = [];

    // Fill daily gaps
    const iterDate = new Date(startDate);
    iterDate.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    while (iterDate <= todayEnd) {
      const dateKey = iterDate.toISOString().slice(0, 10);
      const existing = dailyMap.get(dateKey);
      timeline.push({
        date: dateKey,
        logged: existing ? existing.logged : 0,
        anonymous: existing ? existing.anonymous : 0,
        total: existing ? existing.total : 0,
      });
      iterDate.setDate(iterDate.getDate() + 1);
    }

    return {
      period,
      totalVisits: visits.length,
      loggedVisits,
      anonymousVisits,
      uniqueVisitorsEstimate: uniqueIps.size,
      uniqueLoggedUsers: uniqueUsers.size,
      timeline,
      topPages,
      deviceBreakdown: devices,
    };
  }
}
