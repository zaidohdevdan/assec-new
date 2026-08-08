import { Test, TestingModule } from '@nestjs/testing';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('NoticesController', () => {
  let controller: NoticesController;
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
      controllers: [NoticesController],
      providers: [{ provide: NoticesService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NoticesController>(NoticesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a notice', async () => {
    const dto = { title: 'Novo Aviso', content: 'Detalhes' };
    const mockCreated = { id: 'n1', ...dto };
    service.create.mockResolvedValue(mockCreated);

    const result = await controller.create(dto);
    expect(result).toEqual(mockCreated);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  describe('findAll', () => {
    it('should return all notices when query all=true', async () => {
      const mockAll = [{ id: 'n1' }, { id: 'n2' }];
      service.findAll.mockResolvedValue(mockAll);

      const result = await controller.findAll('true');
      expect(result).toEqual(mockAll);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findPublished).not.toHaveBeenCalled();
    });

    it('should return only published notices when query all is not true', async () => {
      const mockPub = [{ id: 'n1', active: true }];
      service.findPublished.mockResolvedValue(mockPub);

      const result = await controller.findAll();
      expect(result).toEqual(mockPub);
      expect(service.findPublished).toHaveBeenCalled();
    });
  });

  it('should find one notice by id', async () => {
    const mockNotice = { id: 'n1', title: 'Aviso 1' };
    service.findOne.mockResolvedValue(mockNotice);

    const result = await controller.findOne('n1');
    expect(result).toEqual(mockNotice);
    expect(service.findOne).toHaveBeenCalledWith('n1');
  });

  it('should update notice', async () => {
    const dto = { title: 'Título Atualizado' };
    const mockUpdated = { id: 'n1', ...dto };
    service.update.mockResolvedValue(mockUpdated);

    const result = await controller.update('n1', dto);
    expect(result).toEqual(mockUpdated);
    expect(service.update).toHaveBeenCalledWith('n1', dto);
  });

  it('should delete notice', async () => {
    service.remove.mockResolvedValue({ id: 'n1' });

    const result = await controller.remove('n1');
    expect(result).toEqual({ id: 'n1' });
    expect(service.remove).toHaveBeenCalledWith('n1');
  });
});
