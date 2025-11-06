import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentCategory } from '../../entities/document-category.entity';
import { Document } from '../../entities/document.entity';
import { DocumentCategoriesService } from './services/document-categories.service';
import { DocumentsService } from './services/documents.service';
import { DocumentCategoriesController } from './controllers/document-categories.controller';
import { DocumentsController } from './controllers/documents.controller';
import { CategoryDocumentsController } from './controllers/category-documents.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DocumentCategory, Document])],
    providers: [DocumentCategoriesService, DocumentsService],
    controllers: [DocumentCategoriesController, DocumentsController, CategoryDocumentsController],
})
export class DocumentModule {}


