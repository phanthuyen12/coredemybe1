import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsOptional()
  @IsString()
  resetUrl?: string; // URL frontend để reset password (tùy chọn)
}

