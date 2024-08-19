import { IsString } from 'class-validator';

export class FindOneSessionDto {
  @IsString()
  sessionId: string;
}

export class FindUserSessionsDTO {
  @IsString()
  userId: string;
}
