import { 
  Controller, Get, Post, Put, Delete, 
  Param, Body, ParseIntPipe, UsePipes, ValidationPipe 
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductsDto } from "../../dto/products.dto"; 
import { Product } from "../../entities/products.entity";   
import { ResponseData } from "../../common/response-data";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(): Promise<ResponseData<Product[]>> {
    const products = await this.productService.getAll();
    return new ResponseData(products, 200, 'Get all products success');
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<Product>> {
    const product = await this.productService.getById(id);
    return new ResponseData(product, 200, 'Get product by id success');
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() productDto: ProductsDto): Promise<ResponseData<Product>> {
    const product = await this.productService.create(productDto);
    return new ResponseData(product, 201, 'Create product success');
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() productDto: ProductsDto,
  ): Promise<ResponseData<Product>> {
    const product = await this.productService.update(id, productDto);
    return new ResponseData(product, 200, 'Update product success');
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<null>> {
    await this.productService.delete(id);
    return new ResponseData(null, 200, 'Delete product success');
  }
}
