import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { SchedulesModule } from './schedules/schedules.module';
import { NoticesModule } from './notices/notices.module';
import { SlotsModule } from './slots/slots.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NetworkModule } from './network/network.module';
import { BenefitsModule } from './benefits/benefits.module';
import { FinancialsModule } from './financials/financials.module';
import { VideosModule } from './videos/videos.module';
import { CampaignModule } from './campaign/campaign.module';
import { CsrfGuard } from './auth/csrf.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ContactModule,
    SchedulesModule,
    BenefitsModule,
    FinancialsModule,
    NoticesModule,
    SlotsModule,
    NotificationsModule,
    NetworkModule,
    VideosModule,
    CampaignModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global CSRF protection — all POST/PUT/PATCH/DELETE endpoints are validated.
    // Use @SkipCsrf() decorator to exclude pre-auth endpoints (login, register, etc.)
    { provide: APP_GUARD, useClass: CsrfGuard },
  ],
})
export class AppModule {}
