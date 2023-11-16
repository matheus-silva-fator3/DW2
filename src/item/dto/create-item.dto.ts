import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  title: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsNumber()
  sellerId: number;

  @IsNumber()
  authorId: number;

  @IsNumber()
  categoryId: number;
}
