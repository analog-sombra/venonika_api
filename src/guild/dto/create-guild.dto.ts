import { IsNumberString } from 'class-validator';

export class CreateGuildDto {}

export class CreateDbGuildDto {
  @IsNumberString()
  guildId: string;
}
