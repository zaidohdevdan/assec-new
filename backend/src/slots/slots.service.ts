import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SlotsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(professionalId: string, data: { date: string; time: string }) {
    return this.prisma.scheduleSlot.create({
      data: {
        ...data,
        professional: { connect: { id: professionalId } },
      },
    });
  }

  async createBatch(
    professionalId: string,
    slots: Array<{ date: string; time: string }>,
  ) {
    const data = slots.map((s) => ({
      professionalId,
      date: s.date,
      time: s.time,
      status: 'Disponível',
    }));

    return this.prisma.scheduleSlot.createMany({
      data,
    });
  }

  async findAll(filters: { type?: string; professionalId?: string }) {
    if (filters.type) {
      // SV-SE locale generates YYYY-MM-DD format in local server time
      const today = new Date().toLocaleDateString('sv-SE');
      // Find available slots for associates to book from today onwards (no past dates)
      return this.prisma.scheduleSlot.findMany({
        where: {
          status: 'Disponível',
          date: {
            gte: today,
          },
          professional: {
            specialty: filters.type,
          },
        },
        include: {
          professional: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      });
    }

    if (filters.professionalId) {
      const today = new Date().toLocaleDateString('sv-SE');
      // Find professional's own slots for management
      const slots = await this.prisma.scheduleSlot.findMany({
        where: {
          professionalId: filters.professionalId,
        },
        include: {
          schedule: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  matricula: true,
                },
              },
            },
          },
        },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      });

      return slots.map((s) => {
        if (s.date < today) {
          if (s.status === 'Disponível') {
            return { ...s, status: 'Expirado' };
          }
          if (s.status === 'Reservado') {
            return { ...s, status: 'Realizado' };
          }
        }
        return s;
      });
    }

    return this.prisma.scheduleSlot.findMany();
  }

  async findOne(id: string) {
    const slot = await this.prisma.scheduleSlot.findUnique({
      where: { id },
      include: { schedule: true },
    });
    if (!slot) {
      throw new NotFoundException('Vaga não encontrada');
    }
    return slot;
  }

  async update(id: string, professionalId: string, data: { status: string }) {
    const slot = await this.findOne(id);
    if (slot.professionalId !== professionalId) {
      throw new ForbiddenException('Acesso negado');
    }

    // If professional revokes/cancels a slot and it has an active schedule, cancel the schedule
    if (data.status === 'Cancelado' && slot.schedule) {
      await this.prisma.schedule.update({
        where: { id: slot.schedule.id },
        data: { status: 'Cancelado' },
      });
    }

    return this.prisma.scheduleSlot.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, professionalId: string) {
    const slot = await this.prisma.scheduleSlot.findUnique({
      where: { id },
      include: {
        professional: true,
        schedule: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!slot) {
      throw new NotFoundException('Vaga não encontrada');
    }

    if (slot.professionalId !== professionalId) {
      throw new ForbiddenException('Acesso negado');
    }

    // If slot is booked, mark schedule as cancelled instead of just deleting, and notify the associate
    if (slot.schedule) {
      await this.prisma.schedule.update({
        where: { id: slot.schedule.id },
        data: {
          status: 'Cancelado',
          slot: { disconnect: true },
        },
      });

      const formattedDate = slot.date.split('-').reverse().join('/');
      await this.notifications.create(
        slot.schedule.userId,
        'Agendamento Cancelado pelo Profissional',
        `O Dr(a). ${slot.professional.name} cancelou o horário de ${slot.professional.specialty || 'Serviços'} do dia ${formattedDate} às ${slot.time}.`,
      );
    }

    return this.prisma.scheduleSlot.delete({
      where: { id },
    });
  }
}
