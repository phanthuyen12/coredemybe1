import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
import { Repository } from "typeorm";
import { Course } from "../../entities/course.entity";
import { CourseDto } from "../../dto/cource.dto"; 
import { faker } from "@faker-js/faker";
import { Category } from "../../entities/category.entity";
import { promises } from "dns";

@Injectable()
export class CourceService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<Course[]> {
    return this.courseRepository.find({ relations: ['categories'] });
  }

  async getById(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Tạo khóa học
  async create(courceDto: CourseDto): Promise<Course> {
    const newCourse = this.courseRepository.create({
      title: courceDto.title,
      description: courceDto.description,
      thumbnail: courceDto.thumbnail,
      code: courceDto.code,
      active: courceDto.active ?? 1,
      isHeadOfice: courceDto.isHeadOfice ?? null,
    });
    const saved = await this.courseRepository.save(newCourse);

    if (courceDto.isHeadOfice === true) {
      await this.courseRepository
        .createQueryBuilder()
        .update(Course)
        .set({ isHeadOfice: false })
        .where('id != :id', { id: saved.id })
        .execute();
    }

    return saved;
  }

  // Tạo danh mục thuộc khóa học
  async createCategory(courseId: number, name: string, description?: string): Promise<Category> {
    const course = await this.getById(courseId);

    const category = this.categoryRepository.create({
      title: name,
      description,
      course, // liên kết danh mục với khóa học
    });

    return this.categoryRepository.save(category);
  }

  async update(id: number, courceDto: CourseDto): Promise<Course> {
    const course = await this.getById(id);
    if (courceDto.title !== undefined) course.title = courceDto.title;
    if (courceDto.description !== undefined) course.description = courceDto.description;
    if (courceDto.thumbnail !== undefined) course.thumbnail = courceDto.thumbnail;
    if (courceDto.code !== undefined) course.code = courceDto.code;
    if (courceDto.active !== undefined) course.active = courceDto.active;
    if (courceDto.isHeadOfice !== undefined) course.isHeadOfice = courceDto.isHeadOfice;

    const saved = await this.courseRepository.save(course);

    if (courceDto.isHeadOfice === true) {
      await this.courseRepository
        .createQueryBuilder()
        .update(Course)
        .set({ isHeadOfice: false })
        .where('id != :id', { id })
        .execute();
    }

    return saved;
  }

  async delete(id: number): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return;
  }

  async createFakeMany(count: number = 10): Promise<Course[]> {
    const courses: Course[] = [];
    for (let i = 0; i < count; i++) {
      const course = this.courseRepository.create({
        title: faker.company.catchPhrase(),
        description: faker.lorem.sentences(2),
        thumbnail: faker.image.urlLoremFlickr({ category: "education" }),
        code: faker.string.alphanumeric(8).toUpperCase(),
      });
      courses.push(course);
    }
    return this.courseRepository.save(courses);
  }
  async getByIdWithCategoriesAndVideos(id:number):Promise<Course>{
    const res = await this.courseRepository.findOne({
      where:{id},
      relations:["categories", "categories.videos"],
    });
    return res
  }
  async findWithFilter(
    page = 1,
    limit = 10,
    title?: string,
    active?: boolean,
  ): Promise<{ data: Course[]; total: number; page: number; limit: number }> {
    let query = this.courseRepository.createQueryBuilder('course').leftJoinAndSelect('course.categories', 'category');

    if (title) {
      query = query.andWhere('course.title LIKE :title', { title: `%${title}%` });
    }

    if (active !== undefined) {
      query = query.andWhere('course.active = :active', { active });
    }

    const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();

    return { data, total, page, limit };
  }

  async getHeadOfficeCourse(): Promise<Course | null> {
    const course = await this.courseRepository.findOne({ where: { isHeadOfice: true } });
    return course ?? null;
  }
}
