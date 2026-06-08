import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { AuthGuard } from '../auth/auth.guard';
import { type AuthenticatedRequest } from '../auth/auth.types';

@Controller('slots')
@UseGuards(AuthGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body()
    body: {
      slots?: Array<{ date: string; time: string }>;
      date?: string;
      time?: string;
    },
  ) {
    const professionalId = req.user.sub;
    if (body.slots && Array.isArray(body.slots)) {
      return this.slotsService.createBatch(professionalId, body.slots);
    }
    return this.slotsService.create(professionalId, {
      date: body.date || '',
      time: body.time || '',
    });
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('type') type?: string,
    @Query('professionalId') professionalId?: string,
  ) {
    // If querying by specialty type (used by associates when booking)
    if (type) {
      return this.slotsService.findAll({ type });
    }

    // Default to the logged-in professional's ID if no query param is provided
    const idToUse = professionalId || req.user.sub;
    return this.slotsService.findAll({ professionalId: idToUse });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const professionalId = req.user.sub;
    return this.slotsService.remove(id, professionalId);
  }
}
