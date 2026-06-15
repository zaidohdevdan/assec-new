import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { type AuthenticatedRequest } from '../auth/auth.types';

@Controller('schedules')
@UseGuards(AuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('admin/list')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PRESIDENT)
  findAllAdmin() {
    return this.schedulesService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      slotId: string;
      title: string;
      info?: string;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.schedulesService.create({
      userId: req.user.sub,
      slotId: body.slotId,
      title: body.title,
      info: body.info,
    });
  }

  @Get()
  findByUser(@Request() req: AuthenticatedRequest) {
    return this.schedulesService.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      type: string;
      title: string;
      date: string;
      time: string;
      info: string;
      status: string;
    }>,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.schedulesService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.schedulesService.remove(id, req.user.sub);
  }
}
