import { IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;
}
