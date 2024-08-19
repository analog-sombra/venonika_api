import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

export class SettleEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsString()
  eventId: string;
}
