import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

const hostRegex = /^[a-zA-Z0-9.-]+$/;

@Controller('network')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('ping')
  @HttpCode(HttpStatus.OK)
  async ping(@Body('host') host: string) {
    if (!host || !hostRegex.test(host)) {
      throw new BadRequestException('Host inválido. Apenas letras, números, hífen e pontos são permitidos.');
    }
    return this.networkService.ping(host);
  }

  @Post('portscan')
  @HttpCode(HttpStatus.OK)
  async portScan(@Body('host') host: string) {
    if (!host || !hostRegex.test(host)) {
      throw new BadRequestException('Host inválido. Apenas letras, números, hífen e pontos são permitidos.');
    }
    return this.networkService.portScan(host);
  }

  @Post('dns')
  @HttpCode(HttpStatus.OK)
  async dnsLookup(@Body('host') host: string) {
    if (!host || !hostRegex.test(host)) {
      throw new BadRequestException('Host inválido. Apenas letras, números, hífen e pontos são permitidos.');
    }
    return this.networkService.dnsLookup(host);
  }

  @Post('ssl')
  @HttpCode(HttpStatus.OK)
  async sslCheck(@Body('host') host: string) {
    if (!host || !hostRegex.test(host)) {
      throw new BadRequestException('Host inválido. Apenas letras, números, hífen e pontos são permitidos.');
    }
    return this.networkService.sslCheck(host);
  }

  @Post('whois')
  @HttpCode(HttpStatus.OK)
  async whois(@Body('domain') domain: string) {
    if (!domain || !hostRegex.test(domain)) {
      throw new BadRequestException('Domínio inválido. Apenas letras, números, hífen e pontos são permitidos.');
    }
    return this.networkService.whois(domain);
  }
}
