import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBooleanString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindEventDto {
  @IsOptional()
  @IsBooleanString()
  count: boolean;

  @IsOptional()
  @IsIn(['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELED'])
  status: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => (value ? value.split(',') : []))
  unsetteledIds: string[];

  @IsOptional()
  @IsString()
  guildId: string;

  @IsOptional()
  @IsString()
  eventId: string;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsBooleanString()
  featured: boolean;

  @IsOptional()
  @IsNumberString()
  offset: number;

  @IsOptional()
  @IsString()
  category: number;
}
