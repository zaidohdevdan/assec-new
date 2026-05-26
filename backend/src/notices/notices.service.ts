import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.NoticeCreateInput) {
    return this.prisma.notice.create({ data });
  }

  async findAll() {
    return this.prisma.notice.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const notice = await this.prisma.notice.findUnique({ where: { id } });
    if (!notice) throw new NotFoundException('Aviso não encontrado');
    return notice;
  }

  async update(id: string, data: Prisma.NoticeUpdateInput) {
    await this.findOne(id);
    return this.prisma.notice.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notice.delete({ where: { id } });
  }
}
