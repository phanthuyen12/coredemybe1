import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class EnrollmentDto {    
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  start_at?: string;

  @IsDateString()
  @IsOptional()
  end_at?: string;

  @IsString()
  @IsOptional()
  payment_status?: string;

  @IsString()
  @IsOptional()
  voucher_code?: string;
}
