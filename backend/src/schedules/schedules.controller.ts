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
import { type AuthenticatedRequest } from '../auth/auth.types';

@Controller('schedules')
@UseGuards(AuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(
    @Body()
    body: {
      type: string;
      title: string;
      date: string;
      time: string;
      info?: string;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.schedulesService.create({ ...body, userId: req.user.sub });
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
