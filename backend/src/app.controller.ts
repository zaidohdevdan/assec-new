import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return 'ASSEC API';
  }

  @Get('users/public/validate/:id')
  async validateUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Associado não encontrado');
    }
    return {
      valid: true,
      name: user.name,
      cpf: user.cpf,
      rg: user.rg,
      matricula: user.matricula,
      org: user.org,
      status: user.status,
      since: user.since,
      photoUrl: user.photoUrl,
    };
  }
}
