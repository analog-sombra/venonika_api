import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventDto } from './dto/find-event.dto';
import { SettleEventDto } from './dto/settle-event.dto';
import { EventService } from './event.service';
import { DeleteEventDto } from './dto/delete-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Post('/settle/:eventId')
  settle(@Body() discordEvent: SettleEventDto) {
    return this.eventService.settle(discordEvent);
  }

  @Get('/guild/:guildId')
  getAllScheduledEvent(@Param('guildId') guildId: string) {
    return this.eventService.getAllScheduledEvent(guildId);
  }

  @Get()
  findAll(@Query() param?: FindEventDto) {
    return this.eventService.findAll(param);
  }

  @Delete('/discord')
  deleteDiscordEvent(@Query() param?: DeleteEventDto) {
    return this.eventService.deleteDiscordEvent(param);
  }

  @Delete(':eventId')
  delete(@Param('eventId') eventId: string) {
    return this.eventService.deleteEvent(eventId);
  }

  @Put('/:eventId')
  updateDiscordEvent(
    @Param('eventId') eventId: string,
    @Body() discordEvent: UpdateEventDto,
  ) {
    return this.eventService.updateDiscordEvent(eventId, discordEvent);
  }
}
