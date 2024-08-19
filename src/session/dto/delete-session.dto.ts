import { IsString } from 'class-validator';

export class DeleteSessionDto {
  @IsString()
  sessionId: string;
}

export class DeleteUserSessionsDto {
  @IsString()
  userId: string;
}
