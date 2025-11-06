import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Document } from '../../../entities/document.entity';
import { CreateDocumentDto, UpdateDocumentDto } from '../../../dto/document.dto';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly docRepo: Repository<Document>,
    ) {}

    async findAll(): Promise<Document[]> {
        return this.docRepo.find({ order: { id: 'DESC' } });
    }

    async findOne(id: number): Promise<Document> {
        const data = await this.docRepo.findOne({ where: { id } });
        if (!data) throw new NotFoundException(`Document ${id} not found`);
        return data;
    }

    async create(dto: CreateDocumentDto): Promise<Document> {
        const partial: DeepPartial<Document> = dto as unknown as DeepPartial<Document>;
        const entity = this.docRepo.create(partial) as Document; // ensure single entity overload
        return await this.docRepo.save(entity);
    }

    async update(id: number, dto: UpdateDocumentDto): Promise<Document> {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);
        return this.docRepo.save(entity);
    }

    async remove(id: number): Promise<void> {
        const res = await this.docRepo.delete(id);
        if (!res.affected) throw new NotFoundException(`Document ${id} not found`);
    }

    async findByCategory(categoryId: number): Promise<Document[]> {
        return this.docRepo.find({ where: { categoryId }, order: { id: 'DESC' } });
    }
}


