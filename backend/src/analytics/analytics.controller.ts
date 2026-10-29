import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { RecordVisitDto } from './analytics.dto';
import { SkipCsrf } from '../auth/csrf.guard';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_COOKIE = isProduction ? '__Host-assec_session' : 'assec_session';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * POST /analytics/visit
   * Public beacon endpoint to record page views.
   * Uses @SkipCsrf() for seamless non-blocking sendBeacon requests.
   */
  @Post('visit')
  @SkipCsrf()
  @HttpCode(HttpStatus.OK)
  async recordVisit(
    @Body() dto: RecordVisitDto,
    @Req() req: Request & { cookies?: Record<string, string> },
  ) {
    // 1. Try to safely extract the logged-in user from the session cookie.
    //    (No Authorization: Bearer fallback — the session lives only in the HttpOnly cookie.)
    let userId: string | null = null;
    const token: string | undefined = req.cookies?.[SESSION_COOKIE];

    if (token) {
      try {
        const payload = this.jwtService.verify<{ sub: string }>(token, {
          algorithms: ['HS256'],
        });
        if (payload && payload.sub) {
          userId = payload.sub;
        }
      } catch {
        // Unauthenticated or invalid token - treated safely as anonymous
        userId = null;
      }
    }

    // 2. Client IP and User-Agent.
    //    req.ip honours `trust proxy` (main.ts); reading the first X-Forwarded-For
    //    entry directly would trust a value the client can forge.
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    const userAgent = req.headers['user-agent'] || '';

    return this.analyticsService.recordVisit({
      path: dto.path,
      sessionId: dto.sessionId,
      ip,
      userAgent,
      userId,
    });
  }

  /**
   * GET /analytics/stats
   * Protected endpoint for ADMIN and PRESIDENT roles to view visit metrics.
   */
  @Get('stats')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PRESIDENT)
  async getStats(@Query('period') period?: string) {
    return this.analyticsService.getStats(period);
  }
}
