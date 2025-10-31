import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckEnrollmentDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  course_id: number;
}





