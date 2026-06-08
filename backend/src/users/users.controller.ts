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
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('me')
  async updateProfile(
    @Request() req: any,
    @Body()
    data: Partial<{
      name: string;
      cpf: string;
      rg: string;
      matricula: string;
      org: string;
      photoUrl: string;
    }>,
  ) {
    const userId = req.user.sub;
    return this.usersService.update(userId, data);
  }

  @Get('me/export')
  async exportMyData(@Request() req: any) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Delete('me')
  async deleteMyAccount(@Request() req: any) {
    const userId = req.user.sub;
    return this.usersService.deleteUser(userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== Role.ADMIN && req.user.sub !== id) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usersService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() data: any) {
    return this.usersService.create(data);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
