// backend/src/modules/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    // 🔹 Retorno temporário até conectar ao banco
    return {
      totalBeneficios: 12,
      proximosAgendamentos: 2,
      statusCarteira: 'Ativa',
    };
  }

  @Get('schedules')
  @UseGuards(JwtAuthGuard)
  getSchedules() {
    // 🔹 Retorna array vazio por enquanto (evita 404)
    return [];
  }
}
