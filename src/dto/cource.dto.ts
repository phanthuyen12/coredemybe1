import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CourseDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    thumbnail: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiPropertyOptional({ description: 'ID danh mục, có thể null' })
    @IsOptional()
    @IsNumber()
    categoryId?: number;

    @ApiPropertyOptional({ description: 'Trạng thái active (1 = active, 0 = inactive)', default: 1 })
    @IsOptional()
    @IsNumber()
    active?: number = 1;  // mặc định là 1

    @ApiPropertyOptional({ description: 'Cờ xác định khoá học Head Office, mặc định null' })
    @IsOptional()
    @IsBoolean()
    isHeadOfice?: boolean;
}
