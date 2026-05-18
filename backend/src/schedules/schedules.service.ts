import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ScheduleCreateInput) {
    return this.prisma.schedule.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.schedule.findMany({
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.schedule.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.ScheduleUpdateInput) {
    return this.prisma.schedule.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
