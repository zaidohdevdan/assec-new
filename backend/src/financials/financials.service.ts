import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinancialsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FinancialRecordCreateInput) {
    return this.prisma.financialRecord.create({ data });
  }

  async findAll() {
    return this.prisma.financialRecord.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.financialRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Lançamento financeiro não encontrado');
    return record;
  }

  async update(id: string, data: Prisma.FinancialRecordUpdateInput) {
    await this.findOne(id);
    return this.prisma.financialRecord.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.financialRecord.delete({ where: { id } });
  }

  async getStats() {
    const records = await this.prisma.financialRecord.findMany({
      orderBy: { date: 'asc' },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    const monthsMap: Record<string, { month: string; income: number; expense: number }> = {};
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (const rec of records) {
      const amt = rec.amount;
      if (rec.type === 'INCOME') {
        totalIncome += amt;
      } else {
        totalExpense += Math.abs(amt);
      }

      const dateObj = new Date(rec.date);
      const mName = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      const key = `${mName}/${year}`;

      if (!monthsMap[key]) {
        monthsMap[key] = { month: key, income: 0, expense: 0 };
      }

      if (rec.type === 'INCOME') {
        monthsMap[key].income += amt;
      } else {
        monthsMap[key].expense += Math.abs(amt);
      }
    }

    const monthly = Object.values(monthsMap);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthly,
    };
  }
}
