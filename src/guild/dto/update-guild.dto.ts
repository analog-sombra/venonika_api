import { PartialType } from '@nestjs/mapped-types';
import { CreateDbGuildDto, CreateGuildDto } from './create-guild.dto';
import { IsNumberString, IsOptional } from 'class-validator';

export class UpdateGuildDto extends PartialType(CreateGuildDto) {}
export class UpdateDbGuildDto extends PartialType(CreateDbGuildDto) {
  @IsOptional()
  @IsNumberString()
  scrimLogChannel?: string;
}
