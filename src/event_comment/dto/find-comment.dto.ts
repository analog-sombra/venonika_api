import { IsOptional, IsString } from 'class-validator';

export class FindCommentDto {
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
