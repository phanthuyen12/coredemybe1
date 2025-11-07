import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DocumentsService } from '../services/documents.service';
import { Document } from '../../../entities/document.entity';
import { ResponseData } from '../../../common/response-data';

@Controller('api/categories')
export class CategoryDocumentsController {
    constructor(private readonly docsService: DocumentsService) {}

    @Get(':id/documents')
    async getByCategory(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<Document[]>> {
        const data = await this.docsService.findByCategory(id);
        return new ResponseData(data, 200, 'Get documents by category success');
    }
}





