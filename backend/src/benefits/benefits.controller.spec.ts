import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsController } from './benefits.controller';
import { BenefitsService } from './benefits.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('BenefitsController', () => {
  let controller: BenefitsController;
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
      controllers: [BenefitsController],
      providers: [{ provide: BenefitsService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BenefitsController>(BenefitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a benefit', async () => {
    const dto = { title: 'Novo Convênio' } as any;
    const mockCreated = { id: 'b1', ...dto };
    service.create.mockResolvedValue(mockCreated);

    const result = await controller.create(dto);
    expect(result).toEqual(mockCreated);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  describe('findAll', () => {
    it('should return all benefits when all=true', async () => {
      const mockAll = [{ id: 'b1' }, { id: 'b2' }];
      service.findAll.mockResolvedValue(mockAll);

      const result = await controller.findAll('true');
      expect(result).toEqual(mockAll);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return published benefits by default', async () => {
      const mockPub = [{ id: 'b1', active: true }];
      service.findPublished.mockResolvedValue(mockPub);

      const result = await controller.findAll();
      expect(result).toEqual(mockPub);
      expect(service.findPublished).toHaveBeenCalled();
    });
  });

  it('should find one benefit by id', async () => {
    const mockBenefit = { id: 'b1', title: 'Convênio 1' };
    service.findOne.mockResolvedValue(mockBenefit);

    const result = await controller.findOne('b1');
    expect(result).toEqual(mockBenefit);
    expect(service.findOne).toHaveBeenCalledWith('b1');
  });

  it('should update benefit', async () => {
    const dto = { title: 'Título Atualizado' } as any;
    const mockUpdated = { id: 'b1', ...dto };
    service.update.mockResolvedValue(mockUpdated);

    const result = await controller.update('b1', dto);
    expect(result).toEqual(mockUpdated);
    expect(service.update).toHaveBeenCalledWith('b1', dto);
  });

  it('should delete benefit', async () => {
    service.remove.mockResolvedValue({ id: 'b1' });

    const result = await controller.remove('b1');
    expect(result).toEqual({ id: 'b1' });
    expect(service.remove).toHaveBeenCalledWith('b1');
  });
});
