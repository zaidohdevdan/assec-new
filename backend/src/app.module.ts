import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { SchedulesModule } from './schedules/schedules.module';
import { DashboardController } from './modules/dashboard/dashboard.controller';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ContactModule,
    SchedulesModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService],
})
export class AppModule {}
