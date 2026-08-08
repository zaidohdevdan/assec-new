import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('VideosService', () => {
  let service: VideosService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      video: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create video with default active=true', async () => {
      const mockCreated = { id: 'v1', title: 'Assembleia Geral', youtubeUrl: 'https://youtu.be/xyz' };
      prisma.video.create.mockResolvedValue(mockCreated);

      const dto = { title: 'Assembleia Geral', youtubeUrl: 'https://youtu.be/xyz' };
      const result = await service.create(dto);

      expect(result).toEqual(mockCreated);
      expect(prisma.video.create).toHaveBeenCalledWith({
        data: {
          title: 'Assembleia Geral',
          youtubeUrl: 'https://youtu.be/xyz',
          active: true,
        },
      });
    });
  });

  describe('findAll and findPublished', () => {
    it('should return all videos for admin', async () => {
      const mockList = [{ id: 'v1' }, { id: 'v2' }];
      prisma.video.findMany.mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.video.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return only active videos for public portal', async () => {
      const mockList = [{ id: 'v1', active: true }];
      prisma.video.findMany.mockResolvedValue(mockList);

      const result = await service.findPublished();
      expect(result).toEqual(mockList);
      expect(prisma.video.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return video when found', async () => {
      const mockVideo = { id: 'v1', title: 'Vídeo Institucional' };
      prisma.video.findUnique.mockResolvedValue(mockVideo);

      const result = await service.findOne('v1');
      expect(result).toEqual(mockVideo);
    });

    it('should throw NotFoundException when video not found', async () => {
      prisma.video.findUnique.mockResolvedValue(null);
      await expect(service.findOne('v-invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update video when found', async () => {
      prisma.video.findUnique.mockResolvedValue({ id: 'v1', title: 'Old' });
      prisma.video.update.mockResolvedValue({ id: 'v1', title: 'New' });

      const result = await service.update('v1', { title: 'New' });
      expect(result.title).toBe('New');
      expect(prisma.video.update).toHaveBeenCalledWith({
        where: { id: 'v1' },
        data: { title: 'New' },
      });
    });
  });

  describe('remove', () => {
    it('should delete video when found', async () => {
      prisma.video.findUnique.mockResolvedValue({ id: 'v1' });
      prisma.video.delete.mockResolvedValue({ id: 'v1' });

      const result = await service.remove('v1');
      expect(result).toEqual({ id: 'v1' });
      expect(prisma.video.delete).toHaveBeenCalledWith({ where: { id: 'v1' } });
    });
  });
});
