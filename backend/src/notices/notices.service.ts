import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoticeDto, UpdateNoticeDto } from './notices.dto';

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNoticeDto) {
    return this.prisma.notice.create({
      data: {
        title: dto.title,
        summary: dto.summary ?? null,
        content: dto.content,
        type: dto.type ?? 'Institucional',
        tags: dto.tags ?? [],
        coverImage: dto.coverImage ?? null,
        active: dto.active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return this.prisma.notice.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const notice = await this.prisma.notice.findUnique({ where: { id } });
    if (!notice) throw new NotFoundException('Aviso não encontrado');
    return notice;
  }

  async update(id: string, dto: UpdateNoticeDto) {
    await this.findOne(id);
    return this.prisma.notice.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notice.delete({ where: { id } });
  }
}
