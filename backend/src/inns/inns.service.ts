import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InnsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.InnCreateInput) {
    return this.prisma.inn.create({ data });
  }

  async findAll() {
    return this.prisma.inn.findMany({ where: { active: true } });
  }

  async findOne(id: string) {
    const inn = await this.prisma.inn.findUnique({ where: { id } });
    if (!inn) throw new NotFoundException('Pousada não encontrada');
    return inn;
  }

  async update(id: string, data: Prisma.InnUpdateInput) {
    await this.findOne(id);
    return this.prisma.inn.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inn.delete({ where: { id } });
  }
}
