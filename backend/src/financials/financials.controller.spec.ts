import { Test, TestingModule } from '@nestjs/testing';
import { FinancialsController } from './financials.controller';
import { FinancialsService } from './financials.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('FinancialsController', () => {
  let controller: FinancialsController;
  let service: any;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      getStats: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialsController],
      providers: [{ provide: FinancialsService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FinancialsController>(FinancialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create financial record converting string date', async () => {
    const dto = { description: 'Doação', amount: 500, date: '2026-08-01' } as any;
    const mockCreated = { id: 'f1', ...dto };
    service.create.mockResolvedValue(mockCreated);

    const result = await controller.create(dto);
    expect(result).toEqual(mockCreated);
    expect(service.create).toHaveBeenCalled();
  });

  it('should list all financial records', async () => {
    const mockList = [{ id: 'f1' }, { id: 'f2' }];
    service.findAll.mockResolvedValue(mockList);

    const result = await controller.findAll();
    expect(result).toEqual(mockList);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get aggregated stats', async () => {
    const mockStats = { totalIncome: 1000, totalExpense: 400, balance: 600, monthly: [] };
    service.getStats.mockResolvedValue(mockStats);

    const result = await controller.getStats();
    expect(result).toEqual(mockStats);
    expect(service.getStats).toHaveBeenCalled();
  });

  it('should find one record', async () => {
    const mockRec = { id: 'f1', description: 'Item 1' };
    service.findOne.mockResolvedValue(mockRec);

    const result = await controller.findOne('f1');
    expect(result).toEqual(mockRec);
    expect(service.findOne).toHaveBeenCalledWith('f1');
  });

  it('should update record', async () => {
    const dto = { description: 'Atualizado', date: '2026-08-05' } as any;
    const mockUpdated = { id: 'f1', ...dto };
    service.update.mockResolvedValue(mockUpdated);

    const result = await controller.update('f1', dto);
    expect(result).toEqual(mockUpdated);
    expect(service.update).toHaveBeenCalledWith('f1', dto);
  });

  it('should delete record', async () => {
    service.remove.mockResolvedValue({ id: 'f1' });

    const result = await controller.remove('f1');
    expect(result).toEqual({ id: 'f1' });
    expect(service.remove).toHaveBeenCalledWith('f1');
  });
});
