import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ScrimService } from './scrim.service';
import { CreateScrimDto } from './dto/create-scrim.dto';
import { FindScrimDto } from './dto/find-scrim.dto';

@Controller('scrim')
export class ScrimController {
  constructor(private readonly scrimService: ScrimService) {}

  @Post('/')
  create(@Body() createScrimDto: CreateScrimDto) {
    return this.scrimService.create(createScrimDto);
  }

  @Get('/')
  getScrims(@Query() param?: FindScrimDto) {
    return this.scrimService.find(param);
  }

  @Get('/today')
  getTodayScrims() {
    return this.scrimService.findTodayScrim();
  }

  @Delete(':scrimId')
  delete(@Param('scrimId') eventId: string) {
    return this.scrimService.deleteScrim(eventId);
  }
}
