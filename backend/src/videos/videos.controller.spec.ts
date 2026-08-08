import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('VideosController', () => {
  let controller: VideosController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findPublished: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [{ provide: VideosService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<VideosController>(VideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a video', async () => {
    const dto = { title: 'Assembleia 2026', youtubeUrl: 'https://youtube.com/watch?v=123' };
    const mockCreated = { id: 'v1', ...dto };
    service.create.mockResolvedValue(mockCreated);

    const result = await controller.create(dto);
    expect(result).toEqual(mockCreated);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  describe('findAll', () => {
    it('should return all videos when all=true', async () => {
      const mockAll = [{ id: 'v1' }, { id: 'v2' }];
      service.findAll.mockResolvedValue(mockAll);

      const result = await controller.findAll('true');
      expect(result).toEqual(mockAll);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return published videos by default', async () => {
      const mockPub = [{ id: 'v1', active: true }];
      service.findPublished.mockResolvedValue(mockPub);

      const result = await controller.findAll();
      expect(result).toEqual(mockPub);
      expect(service.findPublished).toHaveBeenCalled();
    });
  });

  it('should find one video by id', async () => {
    const mockVideo = { id: 'v1', title: 'Vídeo 1' };
    service.findOne.mockResolvedValue(mockVideo);

    const result = await controller.findOne('v1');
    expect(result).toEqual(mockVideo);
    expect(service.findOne).toHaveBeenCalledWith('v1');
  });

  it('should update video', async () => {
    const dto = { title: 'Título Atualizado' };
    const mockUpdated = { id: 'v1', ...dto };
    service.update.mockResolvedValue(mockUpdated);

    const result = await controller.update('v1', dto);
    expect(result).toEqual(mockUpdated);
    expect(service.update).toHaveBeenCalledWith('v1', dto);
  });

  it('should delete video', async () => {
    service.remove.mockResolvedValue({ id: 'v1' });

    const result = await controller.remove('v1');
    expect(result).toEqual({ id: 'v1' });
    expect(service.remove).toHaveBeenCalledWith('v1');
  });
});
