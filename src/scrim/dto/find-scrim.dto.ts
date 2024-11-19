import {
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindScrimDto {
  @IsOptional()
  @IsString()
  scrimId: string;

  @IsOptional()
  @IsString()
  guildId: string;

  @IsOptional()
  @IsString()
  after?: boolean;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsNumberString()
  offset: number;

  @IsOptional()
  @IsBooleanString()
  count: boolean;
}
