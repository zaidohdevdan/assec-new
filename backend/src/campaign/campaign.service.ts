import {
  Injectable,
  NotFoundException,
  GoneException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PreRegistrationStatus } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  // ─── Public ──────────────────────────────────────────────────────────────

  /** Retorna a campanha se estiver ativa e dentro do prazo */
  async findActiveCampaign(slug: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        expiresAt: true,
        active: true,
        maxSubmissions: true,
        _count: { select: { preRegistrations: true } },
      },
    });

    if (!campaign) throw new NotFoundException('Campanha não encontrada.');

    const now = new Date();
    const expired = now > campaign.expiresAt;
    const full =
      campaign.maxSubmissions !== null &&
      campaign._count.preRegistrations >= campaign.maxSubmissions;

    return {
      ...campaign,
      expired,
      full,
      available: campaign.active && !expired && !full,
    };
  }

  /** Registra um pré-cadastro */
  async createPreRegistration(
    slug: string,
    data: {
      nome: string;
      cpf: string;
      email?: string;
      telefone: string;
      orgao?: string;
      matricula?: string;
    },
    ipAddress?: string,
  ) {
    const campaign = await this.findActiveCampaign(slug);

    if (!campaign.available) {
      if (!campaign.active)
        throw new GoneException('Esta campanha está encerrada.');
      if (campaign.expired)
        throw new GoneException(
          'O prazo desta campanha expirou. Acesse assecce.com.br/associe-se para se filiar.',
        );
      if (campaign.full)
        throw new UnprocessableEntityException(
          'O limite de cadastros desta campanha foi atingido.',
        );
    }

    // Normaliza CPF: remove pontos e traços
    const cpfClean = data.cpf.replace(/\D/g, '');

    // Verifica duplicata por CPF nesta campanha
    const existing = await this.prisma.preRegistration.findUnique({
      where: { cpf_campaignId: { cpf: cpfClean, campaignId: campaign.id } },
    });
    if (existing) {
      throw new ConflictException(
        'Já existe um pré-cadastro com este CPF nesta campanha.',
      );
    }

    return this.prisma.preRegistration.create({
      data: {
        campaignId: campaign.id,
        nome: data.nome.trim(),
        cpf: cpfClean,
        email: data.email?.trim() || null,
        telefone: data.telefone.replace(/\D/g, ''),
        orgao: data.orgao?.trim() || null,
        matricula: data.matricula?.trim() || null,
        ipAddress: ipAddress ?? null,
      },
      select: { id: true, createdAt: true },
    });
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  async createCampaign(data: {
    name: string;
    slug: string;
    description?: string;
    expiresAt: Date;
    maxSubmissions?: number;
  }) {
    return this.prisma.campaign.create({ data });
  }

  async listCampaigns() {
    return this.prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { preRegistrations: true } } },
    });
  }

  async getCampaignWithRegistrations(
    id: string,
    status?: PreRegistrationStatus,
  ) {
    const where = status ? { campaignId: id, status } : { campaignId: id };
    const [campaign, registrations] = await Promise.all([
      this.prisma.campaign.findUniqueOrThrow({ where: { id } }),
      this.prisma.preRegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { campaign, registrations };
  }

  async updateRegistrationStatus(
    registrationId: string,
    status: PreRegistrationStatus,
  ) {
    return this.prisma.preRegistration.update({
      where: { id: registrationId },
      data: { status },
    });
  }

  async toggleCampaign(id: string, active: boolean) {
    return this.prisma.campaign.update({ where: { id }, data: { active } });
  }

  /** Gera CSV para download */
  async exportCsv(campaignId: string): Promise<string> {
    const { registrations } = await this.getCampaignWithRegistrations(
      campaignId,
    );

    const header =
      'ID,Nome,CPF,Email,Telefone,Orgao,Matricula,Status,Cadastrado em\n';
    const rows = registrations
      .map((r) =>
        [
          r.id,
          `"${r.nome}"`,
          r.cpf,
          r.email ?? '',
          r.telefone,
          r.orgao ?? '',
          r.matricula ?? '',
          r.status,
          new Date(r.createdAt).toLocaleString('pt-BR'),
        ].join(','),
      )
      .join('\n');

    return header + rows;
  }
}
