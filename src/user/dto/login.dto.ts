import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @Length(8, 32)
  password: string;
}

export class LoginOutput {
  accessToken: string;
}
