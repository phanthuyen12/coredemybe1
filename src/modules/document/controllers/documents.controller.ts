import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from '../../../dto/document.dto';
import { Document } from '../../../entities/document.entity';
import { ResponseData } from '../../../common/response-data';

@Controller('api/documents')
export class DocumentsController {
    constructor(private readonly service: DocumentsService) {}

    @Get()
    async getAll(): Promise<ResponseData<Document[]>> {
        const data = await this.service.findAll();
        return new ResponseData(data, 200, 'Get documents success');
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<Document>> {
        const data = await this.service.findOne(id);
        return new ResponseData(data, 200, 'Get document success');
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() dto: CreateDocumentDto): Promise<ResponseData<Document>> {
        const data = await this.service.create(dto);
        return new ResponseData(data, 201, 'Create document success');
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDocumentDto,
    ): Promise<ResponseData<Document>> {
        const data = await this.service.update(id, dto);
        return new ResponseData(data, 200, 'Update document success');
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<null>> {
        await this.service.remove(id);
        return new ResponseData(null, 200, 'Deleted successfully');
    }
}





