import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BenefitsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BenefitCreateInput) {
    return this.prisma.benefit.create({ data });
  }

  async findAll() {
    return this.prisma.benefit.findMany({
      orderBy: { title: 'asc' },
    });
  }

  async findPublished() {
    return this.prisma.benefit.findMany({
      where: { active: true },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string) {
    const benefit = await this.prisma.benefit.findUnique({ where: { id } });
    if (!benefit) throw new NotFoundException('Benefício não encontrado');
    return benefit;
  }

  async update(id: string, data: Prisma.BenefitUpdateInput) {
    await this.findOne(id);
    return this.prisma.benefit.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.benefit.delete({ where: { id } });
  }
}
