import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

// Passwords will contain at least 1 upper case letter
// Passwords will contain at least 1 lower case letter
// Passwords will contain at least 1 number or special character
// const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Length(8, 32)
  password: string;

  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
