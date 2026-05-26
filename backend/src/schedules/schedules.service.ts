import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    type: string;
    title: string;
    date: string;
    time: string;
    info?: string;
  }) {
    const { userId, ...rest } = data;
    return this.prisma.schedule.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.schedule.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Agendamento não encontrado');
    return schedule;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{
      type: string;
      title: string;
      date: string;
      time: string;
      info: string;
      status: string;
    }>,
  ) {
    const schedule = await this.findOne(id);
    if (schedule.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.prisma.schedule.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const schedule = await this.findOne(id);
    if (schedule.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.prisma.schedule.delete({ where: { id } });
  }
}
