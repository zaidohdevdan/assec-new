import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Ip,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

const preRegisterSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  cpf: z
    .string()
    .min(11, 'CPF inválido')
    .max(14, 'CPF inválido')
    .regex(/^[\d.\-]+$/, 'CPF inválido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(15, 'Telefone inválido'),
  orgao: z.string().optional(),
  matricula: z.string().optional(),
});

type PreRegisterDto = z.infer<typeof preRegisterSchema>;

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /** GET /campaign/info/:slug — valida campanha (usada pelo frontend para checar antes de exibir o form) */
  @Get('info/:slug')
  async getCampaign(@Param('slug') slug: string) {
    return this.campaignService.findActiveCampaign(slug);
  }

  /** POST /campaign/:slug/register — submete pré-cadastro */
  @Post(':slug/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Param('slug') slug: string,
    @Body(new ZodValidationPipe(preRegisterSchema)) body: PreRegisterDto,
    @Ip() ip: string,
  ) {
    const registration = await this.campaignService.createPreRegistration(
      slug,
      body,
      ip,
    );
    return {
      success: true,
      message:
        'Pré-cadastro realizado com sucesso! Nossa equipe entrará em contato em breve.',
      id: registration.id,
    };
  }
}
