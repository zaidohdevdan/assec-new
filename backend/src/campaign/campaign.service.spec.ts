import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  GoneException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('CampaignService', () => {
  let service: CampaignService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      campaign: {
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      preRegistration: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findActiveCampaign', () => {
    it('should throw NotFoundException if campaign not found', async () => {
      prisma.campaign.findUnique.mockResolvedValue(null);
      await expect(service.findActiveCampaign('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return available: true when campaign is active, not expired, and not full', async () => {
      const mockCampaign = {
        id: 'camp-1',
        name: 'Campanha 2026',
        slug: 'campanha-2026',
        description: 'Desc',
        expiresAt: new Date(Date.now() + 1000000),
        active: true,
        maxSubmissions: 100,
        _count: { preRegistrations: 10 },
      };
      prisma.campaign.findUnique.mockResolvedValue(mockCampaign);

      const result = await service.findActiveCampaign('campanha-2026');
      expect(result.available).toBe(true);
      expect(result.expired).toBe(false);
      expect(result.full).toBe(false);
    });

    it('should return available: false if campaign is expired', async () => {
      const mockCampaign = {
        id: 'camp-1',
        name: 'Campanha 2026',
        slug: 'campanha-2026',
        expiresAt: new Date(Date.now() - 1000000),
        active: true,
        maxSubmissions: 100,
        _count: { preRegistrations: 10 },
      };
      prisma.campaign.findUnique.mockResolvedValue(mockCampaign);

      const result = await service.findActiveCampaign('campanha-2026');
      expect(result.available).toBe(false);
      expect(result.expired).toBe(true);
    });

    it('should return available: false if campaign reached maxSubmissions', async () => {
      const mockCampaign = {
        id: 'camp-1',
        name: 'Campanha 2026',
        slug: 'campanha-2026',
        expiresAt: new Date(Date.now() + 1000000),
        active: true,
        maxSubmissions: 50,
        _count: { preRegistrations: 50 },
      };
      prisma.campaign.findUnique.mockResolvedValue(mockCampaign);

      const result = await service.findActiveCampaign('campanha-2026');
      expect(result.available).toBe(false);
      expect(result.full).toBe(true);
    });
  });

  describe('createPreRegistration', () => {
    it('should throw GoneException if campaign is inactive', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'camp-1',
        slug: 'campanha-2026',
        expiresAt: new Date(Date.now() + 1000000),
        active: false,
        maxSubmissions: 100,
        _count: { preRegistrations: 0 },
      });

      await expect(
        service.createPreRegistration('campanha-2026', {
          nome: 'João Silva',
          cpf: '123.456.789-00',
          telefone: '(85) 99999-9999',
        }),
      ).rejects.toThrow(GoneException);
    });

    it('should throw ConflictException if CPF already registered in this campaign', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'camp-1',
        slug: 'campanha-2026',
        expiresAt: new Date(Date.now() + 1000000),
        active: true,
        maxSubmissions: 100,
        _count: { preRegistrations: 0 },
      });

      prisma.preRegistration.findUnique.mockResolvedValue({
        id: 'reg-1',
        cpf: '12345678900',
      });

      await expect(
        service.createPreRegistration('campanha-2026', {
          nome: 'João Silva',
          cpf: '123.456.789-00',
          telefone: '(85) 99999-9999',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully create preRegistration and normalize CPF and phone', async () => {
      prisma.campaign.findUnique.mockResolvedValue({
        id: 'camp-1',
        slug: 'campanha-2026',
        expiresAt: new Date(Date.now() + 1000000),
        active: true,
        maxSubmissions: 100,
        _count: { preRegistrations: 0 },
      });

      prisma.preRegistration.findUnique.mockResolvedValue(null);
      prisma.preRegistration.create.mockResolvedValue({
        id: 'reg-new',
        createdAt: new Date(),
      });

      const result = await service.createPreRegistration(
        'campanha-2026',
        {
          nome: ' João Silva ',
          cpf: '123.456.789-00',
          email: 'joao@teste.com',
          telefone: '(85) 98888-7777',
        },
        '127.0.0.1',
      );

      expect(result.id).toBe('reg-new');
      expect(prisma.preRegistration.create).toHaveBeenCalledWith({
        data: {
          campaignId: 'camp-1',
          nome: 'João Silva',
          cpf: '12345678900',
          email: 'joao@teste.com',
          telefone: '85988887777',
          orgao: null,
          matricula: null,
          ipAddress: '127.0.0.1',
        },
        select: { id: true, createdAt: true },
      });
    });
  });

  describe('admin operations', () => {
    it('should list all campaigns', async () => {
      const mockList = [{ id: 'camp-1', name: 'Camp 1' }];
      prisma.campaign.findMany.mockResolvedValue(mockList);

      const result = await service.listCampaigns();
      expect(result).toEqual(mockList);
    });

    it('should export registrations as CSV string', async () => {
      prisma.campaign.findUniqueOrThrow.mockResolvedValue({
        id: 'camp-1',
        name: 'Campanha 2026',
      });
      prisma.preRegistration.findMany.mockResolvedValue([
        {
          id: 'reg-1',
          nome: 'João',
          cpf: '12345678900',
          email: 'joao@email.com',
          telefone: '85999999999',
          orgao: 'SEDUC',
          matricula: '1234',
          status: 'PENDENTE',
          createdAt: new Date('2026-08-01T12:00:00Z'),
        },
      ]);

      const csv = await service.exportCsv('camp-1');
      expect(csv).toContain('ID,Nome,CPF,Email,Telefone,Orgao,Matricula,Status,Cadastrado em');
      expect(csv).toContain('"João"');
      expect(csv).toContain('12345678900');
    });
  });
});
