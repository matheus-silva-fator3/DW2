import { IsOptional, IsString, Max, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name: string | undefined;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string | undefined;
}
