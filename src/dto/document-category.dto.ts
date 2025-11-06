import { IsOptional, IsString, Length } from 'class-validator';

export class CreateDocumentCategoryDto {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateDocumentCategoryDto {
    @IsOptional()
    @IsString()
    @Length(1, 255)
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}



