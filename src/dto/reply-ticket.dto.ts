import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReplyTicketDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
