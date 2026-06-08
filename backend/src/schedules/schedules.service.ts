import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SchedulesService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) { }

  async create(data: {
    userId: string;
    slotId: string;
    title: string;
    info?: string;
  }) {
    const { userId, slotId, title, info } = data;

    // Fetch slot to ensure it's available
    const slot = await this.prisma.scheduleSlot.findUnique({
      where: { id: slotId },
      include: { professional: true },
    });

    if (!slot) {
      throw new NotFoundException('Vaga não encontrada');
    }

    if (slot.status !== 'Disponível') {
      throw new ConflictException('Esta vaga já está ocupada ou cancelada');
    }

    // Mark slot as Booked (Reservado)
    await this.prisma.scheduleSlot.update({
      where: { id: slotId },
      data: { status: 'Reservado' },
    });

    const schedule = await this.prisma.schedule.create({
      data: {
        title,
        info,
        date: slot.date,
        time: slot.time,
        type: slot.professional.specialty || 'Geral',
        user: { connect: { id: userId } },
        slot: { connect: { id: slotId } },
      },
      include: {
        user: true,
      },
    });

    // Notify the professional about the new booking
    const formattedDate = slot.date.split('-').reverse().join('/');
    await this.notifications.create(
      slot.professionalId,
      'Novo Agendamento Confirmado',
      `O associado ${schedule.user.name} agendou um atendimento de ${slot.professional.specialty || 'Serviços'} para o dia ${formattedDate} às ${slot.time}.`,
    );

    return schedule;
  }

  async findByUser(userId: string) {
    return this.prisma.schedule.findMany({
      where: { userId },
      include: {
        slot: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { slot: true },
    });
    if (!schedule) throw new NotFoundException('Agendamento não encontrado');
    return schedule;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      info: string;
      status: string;
    }>,
  ) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        slot: {
          include: {
            professional: true,
          },
        },
        user: true,
      },
    });

    if (!schedule) throw new NotFoundException('Agendamento não encontrado');

    if (schedule.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    const updated = await this.prisma.schedule.update({
      where: { id },
      data,
    });

    // If associate cancelled their appointment, release the slot and notify the professional
    if (data.status === 'Cancelado' && schedule.slotId) {
      await this.prisma.scheduleSlot.update({
        where: { id: schedule.slotId },
        data: { status: 'Disponível' },
      });

      if (schedule.slot) {
        const formattedDate = schedule.date.split('-').reverse().join('/');
        await this.notifications.create(
          schedule.slot.professionalId,
          'Agendamento Cancelado pelo Associado',
          `O associado ${schedule.user.name} cancelou o agendamento de ${schedule.slot.professional.specialty || 'Serviços'} do dia ${formattedDate} às ${schedule.time}.`,
        );
      }
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        slot: {
          include: {
            professional: true,
          },
        },
        user: true,
      },
    });

    if (!schedule) throw new NotFoundException('Agendamento não encontrado');

    if (schedule.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    // Release slot if schedule is deleted and notify professional
    if (schedule.slotId) {
      await this.prisma.scheduleSlot.update({
        where: { id: schedule.slotId },
        data: { status: 'Disponível' },
      });

      if (schedule.slot) {
        const formattedDate = schedule.date.split('-').reverse().join('/');
        await this.notifications.create(
          schedule.slot.professionalId,
          'Agendamento Cancelado (Excluído)',
          `O agendamento de ${schedule.user.name} para o dia ${formattedDate} às ${schedule.time} foi excluído.`,
        );
      }
    }

    return this.prisma.schedule.delete({ where: { id } });
  }

  async findAll() {
    return this.prisma.schedule.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            matricula: true,
          },
        },
        slot: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
                specialty: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
