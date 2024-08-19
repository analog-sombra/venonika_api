import { IsOptional, IsString } from 'class-validator';

export class FindCategoryDto {
  @IsOptional()
  active?: boolean;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  id?: string;
}
