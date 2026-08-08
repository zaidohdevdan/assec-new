import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

describe('CampaignController', () => {
  let controller: CampaignController;
  let service: any;

  beforeEach(async () => {
    service = {
      findActiveCampaign: jest.fn(),
      createPreRegistration: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [{ provide: CampaignService, useValue: service }],
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return campaign info on getCampaign', async () => {
    const mockInfo = { id: 'camp-1', name: 'Campanha 2026', available: true };
    service.findActiveCampaign.mockResolvedValue(mockInfo);

    const result = await controller.getCampaign('campanha-2026');
    expect(result).toEqual(mockInfo);
    expect(service.findActiveCampaign).toHaveBeenCalledWith('campanha-2026');
  });

  it('should register pre-registration successfully', async () => {
    service.createPreRegistration.mockResolvedValue({
      id: 'reg-123',
      createdAt: new Date(),
    });

    const dto = {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      telefone: '(85) 99999-9999',
    };

    const result = await controller.register('campanha-2026', dto, '127.0.0.1');

    expect(result.success).toBe(true);
    expect(result.id).toBe('reg-123');
    expect(service.createPreRegistration).toHaveBeenCalledWith(
      'campanha-2026',
      dto,
      '127.0.0.1',
    );
  });
});
