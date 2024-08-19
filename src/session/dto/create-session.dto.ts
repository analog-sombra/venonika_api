import { IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  expiresAt: Date;
}
