import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { InnsService } from './inns.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InnCreateSchema, InnUpdateSchema } from '../common/zod/inn.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('inns')
export class InnsController {
  constructor(private readonly innsService: InnsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(InnCreateSchema))
  create(@Body() data: any) {
    return this.innsService.create(data);
  }

  @Get()
  findAll() {
    return this.innsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.innsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(InnUpdateSchema))
  update(@Param('id') id: string, @Body() data: any) {
    return this.innsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.innsService.remove(id);
  }
}
