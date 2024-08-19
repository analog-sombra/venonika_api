import { IsOptional, IsString } from 'class-validator';

export class FindEventLikeDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  targetId: string;
}
