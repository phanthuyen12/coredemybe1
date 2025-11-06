import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { DocumentCategoriesService } from '../services/document-categories.service';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from '../../../dto/document-category.dto';
import { DocumentCategory } from '../../../entities/document-category.entity';
import { ResponseData } from '../../../common/response-data';

@Controller('api/categories')
export class DocumentCategoriesController {
    constructor(private readonly service: DocumentCategoriesService) {}

    @Get()
    async getAll(): Promise<ResponseData<DocumentCategory[]>> {
        const data = await this.service.findAll();
        return new ResponseData(data, 200, 'Get categories success');
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<DocumentCategory>> {
        const data = await this.service.findOne(id);
        return new ResponseData(data, 200, 'Get category success');
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() dto: CreateDocumentCategoryDto): Promise<ResponseData<DocumentCategory>> {
        const data = await this.service.create(dto);
        return new ResponseData(data, 201, 'Create category success');
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDocumentCategoryDto,
    ): Promise<ResponseData<DocumentCategory>> {
        const data = await this.service.update(id, dto);
        return new ResponseData(data, 200, 'Update category success');
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<null>> {
        await this.service.remove(id);
        return new ResponseData(null, 200, 'Deleted successfully');
    }
}



