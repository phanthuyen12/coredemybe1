import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../entities/video.entity';
import { Course } from '../../entities/course.entity';
import { VideoDto } from '../../dto/video.dto';
import { Category } from '../../entities/category.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async findWithFilter(
    page: number = 1,
    limit: number = 10,
    title?: string,
    categoryId?: number,
    courseId?: number,
    status?: string,
  ): Promise<{ data: Video[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    const query = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.course', 'course')
      .leftJoinAndSelect('video.category', 'category');

    if (status) {
      // bỏ qua nếu undefined, null, hoặc ""
      query.andWhere('video.status = :status', { status });
    }

    if (title) {
      query.andWhere('video.title LIKE :title', { title: `%${title}%` });
    }

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    if (courseId) {
      query.andWhere('course.id = :courseId', { courseId });
    }

    // f (status !== undefined) {
    //       query.andWhere('video.status = :status', { status });
    //     }

    // Đặt lại sắp xếp cố định để đảm bảo phân trang nhất quán
    query.orderBy('video.order', 'ASC').addOrderBy('video.id', 'ASC');

    const [data, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }
  async getAll(): Promise<Video[]> {
    return this.videoRepository.find();
  }
  async getByCourseId(courseId: number): Promise<Video[]> {
    return this.videoRepository.find({
      where: { course: { id: courseId } as any },
    });
  }
  async getById(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }
  async create(videoDto: VideoDto): Promise<Video> {
    const course = await this.courseRepository.findOne({
      where: { id: videoDto.courseId },
    });
    if (!course) {
      throw new NotFoundException(
        `Course with ID ${videoDto.courseId} not found`,
      );
    }

    // Gán category
    const category = await this.categoryRepository.findOne({
      where: { id: videoDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${videoDto.categoryId} not found`,
      );
    }

    const newVideo = this.videoRepository.create({
      title: videoDto.title,
      url: videoDto.url,
      duration: videoDto.duration ?? 0,
      order: videoDto.order ?? 0,
      access: videoDto.access,
      status: videoDto.status,
      description: videoDto.description,
      course, // gán course entity
      category,
    });

    return this.videoRepository.save(newVideo);
  }

 async update(id: number, videoDto: VideoDto): Promise<Video> {
  const video = await this.getById(id); // Lấy video hiện tại, nếu không có sẽ throw

  // Cập nhật title nếu có
  if (videoDto.title !== undefined) video.title = videoDto.title;

  // Cập nhật url nếu có
  if (videoDto.url !== undefined) video.url = videoDto.url;

  // Cập nhật fileName nếu có
  if (videoDto.fileName !== undefined) video.fileName = videoDto.fileName;

  // Cập nhật duration nếu có
  if (videoDto.duration !== undefined) video.duration = videoDto.duration;

  // Cập nhật order nếu có
  if (videoDto.order !== undefined) video.order = videoDto.order;

  // Cập nhật access nếu có
  if (videoDto.access !== undefined) video.access = videoDto.access;

  // Cập nhật description nếu có
  if (videoDto.description !== undefined) video.description = videoDto.description;

  // Cập nhật status nếu có (Active/Inactive)
  if (videoDto.status !== undefined) video.status = videoDto.status;

  // Cập nhật Course nếu có
  if (videoDto.courseId !== undefined) {
    const course = await this.courseRepository.findOne({ where: { id: videoDto.courseId } });
    if (!course) throw new NotFoundException(`Course with ID ${videoDto.courseId} not found`);
    video.course = course;
    video.courseId = course.id;
  }

  // Cập nhật Category nếu có
  if (videoDto.categoryId !== undefined) {
    const category = await this.categoryRepository.findOne({ where: { id: videoDto.categoryId } });
    if (!category) throw new NotFoundException(`Category with ID ${videoDto.categoryId} not found`);
    video.category = category;
    video.categoryId = category.id;
  }

  // Lưu lại video
  return this.videoRepository.save(video);
}

  async delete(id: number): Promise<void> {
    const result = await this.videoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return;
  }
}
