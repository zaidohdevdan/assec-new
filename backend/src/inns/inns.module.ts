import { Module } from '@nestjs/common';
import { InnsController } from './inns.controller';
import { InnsService } from './inns.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InnsController],
  providers: [InnsService],
})
export class InnsModule {}
