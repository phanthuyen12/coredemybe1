import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentCategory } from '../../../entities/document-category.entity';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from '../../../dto/document-category.dto';

@Injectable()
export class DocumentCategoriesService {
    constructor(
        @InjectRepository(DocumentCategory)
        private readonly categoryRepo: Repository<DocumentCategory>,
    ) {}

    async findAll(): Promise<DocumentCategory[]> {
        return this.categoryRepo.find({ order: { id: 'DESC' } });
    }

    async findOne(id: number): Promise<DocumentCategory> {
        const data = await this.categoryRepo.findOne({ where: { id } });
        if (!data) throw new NotFoundException(`Category ${id} not found`);
        return data;
    }

    async create(dto: CreateDocumentCategoryDto): Promise<DocumentCategory> {
        const entity = this.categoryRepo.create(dto);
        return this.categoryRepo.save(entity);
    }

    async update(id: number, dto: UpdateDocumentCategoryDto): Promise<DocumentCategory> {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);
        return this.categoryRepo.save(entity);
    }

    async remove(id: number): Promise<void> {
        const res = await this.categoryRepo.delete(id);
        if (!res.affected) throw new NotFoundException(`Category ${id} not found`);
    }
}





