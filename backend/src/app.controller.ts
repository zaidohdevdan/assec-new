import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users/users.service';

/** `12345678901` -> `***.***.789-**` (shows only the 3 middle digits). */
export function maskCpf(cpf: string | null): string | null {
  if (!cpf) return null;
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return '***';
  return `***.***.${digits.substring(6, 9)}-**`;
}

/** `20081234567` -> `***.4567` (shows only the last 4 characters). */
export function maskRg(rg: string | null): string | null {
  if (!rg) return null;
  return rg.length > 4 ? `***.${rg.substring(rg.length - 4)}` : '***';
}

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return 'ASSEC API';
  }

  /**
   * Public card-validation endpoint (QR code on the digital card).
   * Unauthenticated by design, so it must NEVER return full personal
   * documents: CPF and RG are masked on the server (masking only in the UI
   * would still leak the raw values in the API response).
   */
  @Get('users/public/validate/:id')
  async validateUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Associado não encontrado');
    }
    return {
      valid: true,
      name: user.name,
      cpf: maskCpf(user.cpf),
      rg: maskRg(user.rg),
      matricula: user.matricula,
      org: user.org,
      status: user.status,
      since: user.since,
      photoUrl: user.photoUrl,
    };
  }
}
