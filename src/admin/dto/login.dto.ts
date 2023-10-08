import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Um email valido para o usuario',
  })
  @IsEmail()
  email: string;

  @Length(8, 32)
  password: string;
}

export class LoginOutput {
  accessToken: string;
}
