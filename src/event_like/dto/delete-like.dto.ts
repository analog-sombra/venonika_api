import { IsString } from 'class-validator';

export class DeleteEventLikeDto {
  @IsString()
  userId: string;

  @IsString()
  targetId: string;
}
