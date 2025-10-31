import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  Query,
  BadRequestException
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../entities/category.entity';
import { CategoryDto } from '../../dto/category.dto';
import { ResponseData } from '../../common/response-data';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
@Get('filter')
  @ApiOkResponse({ description: 'api get category' })

@Get('filter')
async findWithFilter(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('q') title?: string,
  @Query('active') active?: string,
  @Query('courseId') courseId?: string,
) {
  const pageNum = page && page.trim() !== '' ? parseInt(page, 10) : 1;
  const limitNum = limit && limit.trim() !== '' ? parseInt(limit, 10) : 10;

  if (isNaN(pageNum) || pageNum < 1) {
    throw new BadRequestException('Page must be a positive number');
  }
  if (isNaN(limitNum) || limitNum < 1) {
    throw new BadRequestException('Limit must be a positive number');
  }

  // active xử lý riêng
  const isActive =
    active && active.trim() !== ''
      ? active.toLowerCase() === 'true'
        ? true
        : active.toLowerCase() === 'false'
        ? false
        : (() => {
            throw new BadRequestException('active must be true or false');
          })()
      : undefined;

  // courseId
  const courseIdNum =
    courseId && courseId.trim() !== ''
      ? (() => {
          const parsed = parseInt(courseId, 10);
          if (isNaN(parsed)) {
            throw new BadRequestException('courseId must be a number');
          }
          return parsed;
        })()
      : undefined;

  const safeTitle = title && title.trim() !== '' ? title : undefined;

  const res = await this.categoryService.findWithFilters(
    pageNum,
    limitNum,
    safeTitle,
    isActive,
    courseIdNum,
  );

  return new ResponseData(res, 200, 'Get filtered categories success');
}

  @Post('update/:id')
  @ApiOkResponse({ description: 'Update category' })
  @UseInterceptors(AnyFilesInterceptor()) // parse form-data
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CategoryDto,
  ): Promise<ResponseData<Category>> {
    const data = await this.categoryService.update(id, dto);
    return new ResponseData(data, 200, 'Category updated successfully');
  }

  @Get()
  @ApiOkResponse({ description: 'Get all categories' })
  async findAll(): Promise<ResponseData<Category[]>> {
    const data = await this.categoryService.findAll();
    return new ResponseData(data, 200, 'Get all categories success');
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get category by id' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<Category>> {
    const data = await this.categoryService.findOne(id);
    return new ResponseData(data, 200, 'Get category success');
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create category' })
  @UseInterceptors(AnyFilesInterceptor()) // cần để parse form-data
  async create(@Body() dto: CategoryDto): Promise<ResponseData<Category>> {
    const data = await this.categoryService.create(dto);
    return new ResponseData(data, 200, 'Category created successfully');
  }

  

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete category' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<null>> {
    await this.categoryService.remove(id);
    return new ResponseData(null, 200, 'Category deleted successfully');
  }




}
