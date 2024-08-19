import { IsNumberString, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  guildId: string;

  @IsString()
  channelId: string;

  @IsString()
  creatorId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  tags: string;

  @IsString()
  scheduledStartTime: string;

  @IsString()
  eventCategory: string;

  @IsString()
  imageUrl: string;

  @IsNumberString()
  entityType: string;
}
