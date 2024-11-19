import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScrimDto {
  @IsString()
  guildId: string;

  @IsString()
  name: string;

  @IsString()
  registrationChannel: string;

  @IsString()
  allowedRole: string;

  @IsString()
  registeredRole: string;

  @IsNumber()
  slot: string;

  @IsOptional()
  @IsNumber()
  teamMember?: string;

  @IsString()
  registrationStartDateTime: string;

  @IsString()
  registrationEndDateTime: string;
}
