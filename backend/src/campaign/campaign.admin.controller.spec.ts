import { Test, TestingModule } from '@nestjs/testing';
import { CampaignAdminController } from './campaign.admin.controller';
import { CampaignService } from './campaign.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PreRegistrationStatus } from '@prisma/client';

describe('CampaignAdminController', () => {
  let controller: CampaignAdminController;
  let service: any;

  beforeEach(async () => {
    service = {
      createCampaign: jest.fn(),
      listCampaigns: jest.fn(),
      getCampaignWithRegistrations: jest.fn(),
      exportCsv: jest.fn(),
      toggleCampaign: jest.fn(),
      updateRegistrationStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignAdminController],
      providers: [{ provide: CampaignService, useValue: service }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CampaignAdminController>(CampaignAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create campaign', async () => {
    const mockCreated = { id: 'camp-1', name: 'Nova Campanha' };
    service.createCampaign.mockResolvedValue(mockCreated);

    const dto = {
      name: 'Nova Campanha',
      slug: 'nova-campanha',
      expiresAt: '2026-12-31T23:59:59.000Z',
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockCreated);
    expect(service.createCampaign).toHaveBeenCalledWith({
      name: 'Nova Campanha',
      slug: 'nova-campanha',
      expiresAt: new Date('2026-12-31T23:59:59.000Z'),
    });
  });

  it('should list campaigns', async () => {
    const mockList = [{ id: 'camp-1', name: 'Camp 1' }];
    service.listCampaigns.mockResolvedValue(mockList);

    const result = await controller.list();
    expect(result).toEqual(mockList);
  });

  it('should get campaign with registrations', async () => {
    const mockData = { campaign: { id: 'camp-1' }, registrations: [] };
    service.getCampaignWithRegistrations.mockResolvedValue(mockData);

    const result = await controller.getRegistrations('camp-1', PreRegistrationStatus.PENDENTE);
    expect(result).toEqual(mockData);
    expect(service.getCampaignWithRegistrations).toHaveBeenCalledWith(
      'camp-1',
      PreRegistrationStatus.PENDENTE,
    );
  });

  it('should toggle campaign active state', async () => {
    service.toggleCampaign.mockResolvedValue({ id: 'camp-1', active: false });

    const result = await controller.toggle('camp-1', false);
    expect(result.active).toBe(false);
    expect(service.toggleCampaign).toHaveBeenCalledWith('camp-1', false);
  });

  it('should update registration status', async () => {
    service.updateRegistrationStatus.mockResolvedValue({
      id: 'reg-1',
      status: PreRegistrationStatus.CONTATADO,
    });

    const result = await controller.updateStatus('reg-1', PreRegistrationStatus.CONTATADO);
    expect(result.status).toBe(PreRegistrationStatus.CONTATADO);
    expect(service.updateRegistrationStatus).toHaveBeenCalledWith(
      'reg-1',
      PreRegistrationStatus.CONTATADO,
    );
  });

  it('should export csv with appropriate headers and content', async () => {
    service.exportCsv.mockResolvedValue('ID,Nome\n1,"João"');

    const res: any = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    await controller.exportCsv('camp-1', res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      expect.stringContaining('attachment; filename='),
    );
    expect(res.send).toHaveBeenCalledWith('\uFEFFID,Nome\n1,"João"');
  });
});
