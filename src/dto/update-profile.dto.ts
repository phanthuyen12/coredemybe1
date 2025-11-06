import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @MinLength(2)
  username: string;

  @IsEmail()
  email: string;
}




