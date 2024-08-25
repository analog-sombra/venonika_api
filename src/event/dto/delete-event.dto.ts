import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteEventDto {
  @IsString()
  @IsNotEmpty()
  guildId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;
}
