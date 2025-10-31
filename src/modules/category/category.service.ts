import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CategoryDto } from '../../dto/category.dto';
import { Course } from '../../entities/course.entity';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(dto: CategoryDto): Promise<Category> {
    const entity = this.categoryRepository.create(dto);
    return this.categoryRepository.save(entity);
  }
async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['course'], // lấy cả course nếu cần
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, dto: CategoryDto): Promise<Category> {
    const category = await this.getById(id);

    // Update các giá trị nếu có
    if (dto.title !== undefined) category.title = dto.title;
    if (dto.description !== undefined) category.description = dto.description;

    // Convert active nếu gửi string từ form-data
    if (dto.active !== undefined) {
      category.active =
        typeof dto.active === 'string'
          ? dto.active === 'true' || dto.active === '1'
          : dto.active;
    }

    // Convert courseId nếu gửi string
    if (dto.courseId !== undefined) {
  const courseIdNumber =
    typeof dto.courseId === 'string' ? parseInt(dto.courseId, 10) : dto.courseId;

  // Load course thực sự
  const course = await this.categoryRepository.manager.findOne(Course, {
    where: { id: courseIdNumber },
  });
  if (!course) throw new NotFoundException(`Course ID ${courseIdNumber} not found`);

  category.course = course;   // gán quan hệ
  category.courseId = courseIdNumber; // gán column
}


    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
async findWithFilters(
  page = 1,
  limit = 10,
  title?: string,
  active?: boolean,
  courseId?: number,   // ✅ thêm tham số này
): Promise<{ data: Category[]; total: number; page: number; limit: number; courseId?: number }> {
  let query = this.categoryRepository
    .createQueryBuilder('categories')
    .leftJoinAndSelect('categories.course', 'course'); // join đúng quan hệ

  if (title) {
    query = query.andWhere('categories.title LIKE :title', { title: `%${title}%` });
  }

  if (active !== undefined) {
    query = query.andWhere('categories.active = :active', { active });
  }

  if (courseId !== undefined) {
    query = query.andWhere('categories.courseId = :courseId', { courseId });
  }

  const [data, total] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { data, total, page, limit, courseId };
}


}


