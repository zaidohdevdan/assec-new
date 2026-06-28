import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
