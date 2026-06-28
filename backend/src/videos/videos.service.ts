import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto, UpdateVideoDto } from './videos.dto';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        title: dto.title,
        youtubeUrl: dto.youtubeUrl,
        active: dto.active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return this.prisma.video.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video) throw new NotFoundException('Vídeo não encontrado');
    return video;
  }

  async update(id: string, dto: UpdateVideoDto) {
    await this.findOne(id);
    return this.prisma.video.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.youtubeUrl !== undefined && { youtubeUrl: dto.youtubeUrl }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.video.delete({ where: { id } });
  }
}
