import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;   // <-- ở đây dùng "message"
  @IsNotEmpty()
  @IsString()
  issueType: string;   // <-- ở đây dùng "message"

  @IsOptional()
  @IsString()
  image?: string;
}
