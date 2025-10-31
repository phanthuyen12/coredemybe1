import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
import { Repository } from "typeorm";
import { Product } from "../../entities/products.entity"; 
import { ProductsDto } from "../../dto/products.dto"; 
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}
    async getAll(): Promise<Product[]> {
        return this.productRepository.find();
    }
    async getById(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async create(productDto: ProductsDto): Promise<Product> {
        const newProduct = this.productRepository.create(productDto);
        return this.productRepository.save(newProduct);
    }
    async update(id: number, productDto: ProductsDto): Promise<Product> {   
        const product = await this.getById(id);
        Object.assign(product, productDto);
        return this.productRepository.save(product);
    }
    async delete(id: number): Promise<void> {   
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return;
    }
}