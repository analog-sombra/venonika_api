import { IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  channelId: string;
}
