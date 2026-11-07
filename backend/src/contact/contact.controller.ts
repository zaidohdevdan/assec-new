import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SkipCsrf } from '../auth/csrf.guard';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

const createContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(5),
});

type CreateContactDto = z.infer<typeof createContactSchema>;

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @SkipCsrf()
  @Post()
  @UsePipes(new ZodValidationPipe(createContactSchema))
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactService.createMessage(createContactDto);
    return { success: true, message: 'Message sent successfully' };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PRESIDENT)
  async findAll() {
    return this.contactService.getMessages();
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PRESIDENT)
  async updateReadStatus(
    @Param('id') id: string,
    @Body() body?: { read?: boolean },
  ) {
    const read = typeof body?.read === 'boolean' ? body.read : true;
    return this.contactService.updateReadStatus(id, read);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.contactService.deleteMessage(id);
    return { success: true };
  }
}
