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
import { VideosService } from './videos.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateVideoDto, UpdateVideoDto } from './videos.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  /** POST /videos — Admin only */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  create(@Body() dto: CreateVideoDto) {
    return this.videosService.create(dto);
  }

  /**
   * GET /videos
   * - ?all=true  → returns every video (admin use)
   * - default    → returns only active videos
   */
  @Get()
  findAll(@Query('all') all?: string) {
    if (all === 'true') return this.videosService.findAll();
    return this.videosService.findPublished();
  }

  /** GET /videos/:id */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  /** PUT /videos/:id — Admin only */
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return this.videosService.update(id, dto);
  }

  /** DELETE /videos/:id — Admin only */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
