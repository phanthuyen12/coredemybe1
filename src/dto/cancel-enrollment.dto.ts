import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CancelEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['refunded', 'expired'])
  status: 'refunded' | 'expired';
}







