import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string | undefined;

  @Length(8, 32)
  @IsOptional()
  password: string | undefined;
}
