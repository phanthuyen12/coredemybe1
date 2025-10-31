import { IsNotEmpty, IsOptional, IsEnum, IsInt, Min ,IsString} from 'class-validator';

export class VideoDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  url?: string;  
  
  @IsOptional()
  fileName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number; // giây

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsEnum(['Free', 'Premium'])
  access: 'Free' | 'Premium' = 'Free';

  @IsOptional()
  description?: string;

  @IsEnum(['Active', 'Inactive'])
  status?: 'Active' | 'Inactive' = 'Active';

  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  categoryId: number;
}
