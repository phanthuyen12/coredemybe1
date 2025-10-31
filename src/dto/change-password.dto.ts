import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
