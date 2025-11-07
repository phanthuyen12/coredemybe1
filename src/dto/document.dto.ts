import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length, IsBoolean } from 'class-validator';

export class CreateDocumentDto {
    @IsOptional()
    @IsInt()
    categoryId?: number | null;

    @IsString()
    @Length(1, 255)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @Length(1, 500)
    link: string; // not strictly URL due to possible drive/file links

    @IsString()
    @Length(1, 50)
    type: string; // e.g., sheet, pdf, doc, slide

    @IsOptional()
    @IsInt()
    uploadedBy?: number | null;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateDocumentDto {
    @IsOptional()
    @IsInt()
    categoryId?: number | null;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @Length(1, 500)
    link?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    type?: string;

    @IsOptional()
    @IsInt()
    uploadedBy?: number | null;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}





