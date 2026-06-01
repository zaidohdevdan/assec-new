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
import { NoticesService } from './notices.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  NoticeCreateSchema,
  NoticeUpdateSchema,
} from '../common/zod/notice.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(NoticeCreateSchema))
  create(@Body() data: any) {
    return this.noticesService.create(data);
  }

  @Get()
  findAll() {
    return this.noticesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(NoticeUpdateSchema))
  update(@Param('id') id: string, @Body() data: any) {
    return this.noticesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.noticesService.remove(id);
  }
}
