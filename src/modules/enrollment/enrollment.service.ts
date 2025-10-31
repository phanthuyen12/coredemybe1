import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../../entities/enrollment.entity';
import { EnrollmentDto } from '../../dto/enrollment.dto';
import { CreateEnrollmentDto } from '../../dto/create-enrollment.dto';
import { CheckEnrollmentDto } from '../../dto/check-enrollment.dto';
import { CancelEnrollmentDto } from '../../dto/cancel-enrollment.dto';
import { T } from '@faker-js/faker/dist/airline-CLphikKp';
@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly courseRepository: Repository<Enrollment>, // 👈 Nest sẽ inject ở đây
  ) {}
  async create(enrollmentDto: EnrollmentDto): Promise<Enrollment> {
    const enrollment = this.courseRepository.create(enrollmentDto);
    return this.courseRepository.save(enrollment);
  }
    async checkAccess(
    dto: CheckEnrollmentDto,
  ): Promise<{ canAccess: boolean; message: string }> {
    const userId = Number(dto.user_id);
    const courseId = Number(dto.course_id);

    const enrollment = await this.courseRepository.findOne({
      where: { userId, courseId },
    });

    console.log('Found enrollment:', enrollment);
    if (!enrollment) {
      return { canAccess: false, message: 'User has not purchased this course' };
    }

    if (enrollment.status !== 'active') {
      return { canAccess: false, message: 'User enrollment is not active' };
    }

    if (enrollment.end_at && enrollment.end_at < new Date()) {
      return { canAccess: false, message: 'User enrollment has expired' };
    }

    return { canAccess: true, message: 'User has access to this course' };
  }
  async findWithFilters(
    userId?: number,
    courseId?: number,
  ): Promise<Enrollment[]> {
    const where: any = {};
    if (userId !== undefined) where.userId = userId;
    if (courseId !== undefined) where.courseId = courseId;
    return this.courseRepository.find({ where });
  }

  async findWithFiltersPaginated(
    page: number = 1,
    limit: number = 10,
    userId?: number,
    courseId?: number,
  ): Promise<{
    data: Enrollment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const where: any = {};
    if (userId !== undefined) where.userId = userId;
    if (courseId !== undefined) where.courseId = courseId;

    const [data, total] = await this.courseRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit };
  }
  async findAll(): Promise<Enrollment[]> {
    return this.courseRepository.find();
  }
  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.courseRepository.findOne({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }
  async update(id: number, enrollmentDto: EnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.courseRepository.preload({
      id: id,
      ...enrollmentDto,
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return this.courseRepository.save(enrollment);
  }
  async remove(id: number): Promise<void> {
    const enrollment = await this.findOne(id);
    await this.courseRepository.remove(enrollment);
  }

  // New methods for the requested APIs
  async createEnrollment(
    dto: any,
  ): Promise<{
    userId: number;
    courseId: number;
    status: string;
    message: string;
  }> {
    // // Check if user already has enrollment for this course
    const existingEnrollment = await this.courseRepository.findOne({
      where: {
        userId: dto.userId,
        courseId: dto.courseId,
      },
    });
    console.log('Existing enrollment:', existingEnrollment);
    if (existingEnrollment) {
      return {
        userId: dto.userId,
        courseId: dto.courseId,
        status: 'active',

        message: 'User enrolled successfully',
      };
    } else {
      const enrollment = this.courseRepository.create({
        userId: dto.userId,
        courseId: dto.courseId,
        status: 'active',
        end_at: dto.expire_at ? new Date(dto.expire_at) : null,
        note: dto.note,
        payment_status: 'paid', // Assuming enrollment means paid
      });

      await this.courseRepository.save(enrollment);

      return {
        userId: dto.userId,
        courseId: dto.courseId,
        status: 'active',
        message: 'User enrolled successfully',
      };
    }
    // if (existingEnrollment) {
    //     if (existingEnrollment.status === 'active') {
    //         throw new ConflictException('User already has access to this course');
    //     } else {
    //         // Update existing enrollment to active
    //         existingEnrollment.status = 'active';
    //         if (dto.expire_at) {
    //             existingEnrollment.end_at = new Date(dto.expire_at);
    //         }
    //         if (dto.note) {
    //             existingEnrollment.note = dto.note;
    //         }
    //         await this.courseRepository.save(existingEnrollment);

    //         return {
    //             userId: dto.userId,
    //             courseId: dto.courseId,
    //             status: 'active',
    //             message: 'User enrollment reactivated successfully'
    //         };
    //     }
    // }
    // console.log('Creating enrollment with DTO:', dto);
    // Create new enrollment
  }



  async cancelEnrollment(
    id: number,
    dto: CancelEnrollmentDto,
  ): Promise<{ message: string; status: string }> {
    const enrollment = await this.findOne(id);

    enrollment.status = dto.status;
    await this.courseRepository.save(enrollment);

    return {
      message: 'Enrollment has been canceled',
      status: dto.status,
    };
  }
}
