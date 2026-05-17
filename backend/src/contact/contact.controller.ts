import { Controller, Post, Body, Get, UsePipes } from '@nestjs/common';
import { ContactService } from './contact.service';
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

  @Post()
  @UsePipes(new ZodValidationPipe(createContactSchema))
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactService.createMessage(createContactDto);
    return { success: true, message: 'Message sent successfully' };
  }

  @Get()
  async findAll() {
    return this.contactService.getMessages();
  }
}
