import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventsGateway } from './events.gateway';

@Module({
  controllers: [EventController],
  providers: [EventService, EventsGateway],
})
export class EventModule {}
