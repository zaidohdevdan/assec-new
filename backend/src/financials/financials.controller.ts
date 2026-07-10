import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { FinancialsService } from './financials.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('financials')
@UseGuards(AuthGuard, RolesGuard)
export class FinancialsController {
  constructor(private readonly financialsService: FinancialsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CONTABILIDADE)
  create(@Body() data: Prisma.FinancialRecordCreateInput) {
    // Convert date string/input to actual Date object if it arrives as string
    if (data.date && typeof data.date === 'string') {
      data.date = new Date(data.date);
    }
    return this.financialsService.create(data);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PRESIDENT, Role.CONTABILIDADE)
  findAll() {
    return this.financialsService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.PRESIDENT, Role.CONTABILIDADE)
  getStats() {
    return this.financialsService.getStats();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PRESIDENT, Role.CONTABILIDADE)
  findOne(@Param('id') id: string) {
    return this.financialsService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.CONTABILIDADE)
  update(
    @Param('id') id: string,
    @Body() data: Prisma.FinancialRecordUpdateInput,
  ) {
    if (data.date && typeof data.date === 'string') {
      data.date = new Date(data.date);
    }
    return this.financialsService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.CONTABILIDADE)
  remove(@Param('id') id: string) {
    return this.financialsService.remove(id);
  }
}
