import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  globalName: string;

  @IsBoolean()
  @IsOptional()
  mfaEnabled: string;

  @IsBoolean()
  @IsOptional()
  verified: string;
}
