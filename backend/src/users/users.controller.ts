import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Request,
  Body,
  UseGuards,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Prisma } from '@prisma/client';
import type { AuthenticatedRequest } from '../auth/auth.types';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('me')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body()
    data: Partial<{
      name: string;
      avatarUrl: string;
    }>,
  ) {
    const userId = req.user.sub;
    const updatePayload: Partial<{ name: string; avatarUrl: string }> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl;

    return this.usersService.update(userId, updatePayload);
  }

  @Get('me/export')
  async exportMyData(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Delete('me')
  async deleteMyAccount(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.usersService.deleteUser(userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.PRESIDENT)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    if (
      req.user.role !== Role.ADMIN &&
      req.user.role !== Role.PRESIDENT &&
      req.user.sub !== id
    ) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() data: Parameters<UsersService['update']>[1],
  ) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
