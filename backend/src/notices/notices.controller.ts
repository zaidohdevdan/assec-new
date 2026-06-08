import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { NoticesService } from './notices.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateNoticeDto, UpdateNoticeDto } from './notices.dto';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  /** POST /notices — Admin only */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateNoticeDto) {
    return this.noticesService.create(dto);
  }

  /**
   * GET /notices
   * - ?all=true  → returns every record (admin use)
   * - default    → returns only active/published records (public portal)
   */
  @Get()
  findAll(@Query('all') all?: string) {
    if (all === 'true') return this.noticesService.findAll();
    return this.noticesService.findPublished();
  }

  /** GET /notices/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  /** PUT /notices/:id — Admin only */
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.noticesService.update(id, dto);
  }

  /** DELETE /notices/:id — Admin only */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.noticesService.remove(id);
  }
}
