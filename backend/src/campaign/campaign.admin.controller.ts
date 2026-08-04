import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { CampaignService } from './campaign.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PreRegistrationStatus, Role } from '@prisma/client';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

const createCampaignSchema = z.object({
  name: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug deve conter apenas letras minúsculas, números e hífens',
    }),
  description: z.string().optional(),
  expiresAt: z.string().datetime({ message: 'Data de expiração inválida (ISO 8601)' }),
  maxSubmissions: z.number().int().positive().optional(),
});

type CreateCampaignDto = z.infer<typeof createCampaignSchema>;

@Controller('campaign/admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PRESIDENT, Role.CONTABILIDADE)
export class CampaignAdminController {
  constructor(private readonly campaignService: CampaignService) {}

  /** POST /campaign/admin — cria nova campanha */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidationPipe(createCampaignSchema)) body: CreateCampaignDto) {
    return this.campaignService.createCampaign({
      ...body,
      expiresAt: new Date(body.expiresAt),
    });
  }

  /** GET /campaign/admin — lista todas campanhas */
  @Get()
  async list() {
    return this.campaignService.listCampaigns();
  }

  /** GET /campaign/admin/:id/registrations?status=PENDENTE — lista pré-cadastros */
  @Get(':id/registrations')
  async getRegistrations(
    @Param('id') id: string,
    @Query('status') status?: PreRegistrationStatus,
  ) {
    return this.campaignService.getCampaignWithRegistrations(id, status);
  }

  /** GET /campaign/admin/:id/export — download CSV */
  @Get(':id/export')
  async exportCsv(@Param('id') id: string, @Res() res: Response) {
    const csv = await this.campaignService.exportCsv(id);
    const filename = `pre-cadastros-${id}-${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM UTF-8 para Excel reconhecer acentuação
  }

  /** PATCH /campaign/admin/:id/toggle — ativa/desativa campanha */
  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @Body('active') active: boolean) {
    return this.campaignService.toggleCampaign(id, active);
  }

  /** PATCH /campaign/admin/registration/:regId/status — atualiza status do pré-cadastro */
  @Patch('registration/:regId/status')
  async updateStatus(
    @Param('regId') regId: string,
    @Body('status') status: PreRegistrationStatus,
  ) {
    return this.campaignService.updateRegistrationStatus(regId, status);
  }
}
