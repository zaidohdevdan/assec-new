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
    // 1. Try to safely extract logged-in user from session cookie or Authorization header
    let userId: string | null = null;
    let token: string | undefined = req.cookies?.[SESSION_COOKIE];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const payload = this.jwtService.verify<{ sub: string }>(token);
        if (payload && payload.sub) {
          userId = payload.sub;
        }
      } catch {
        // Unauthenticated or invalid token - treated safely as anonymous
        userId = null;
      }
    }

    // 2. Extract Client IP and User-Agent
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : Array.isArray(forwarded)
          ? forwarded[0].trim()
          : req.socket.remoteAddress) || '127.0.0.1';

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
