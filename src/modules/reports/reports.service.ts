import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Enrollment } from '../../entities/enrollment.entity';
import { Video } from '../../entities/video.entity';
import { Course } from '../../entities/course.entity';
import { VideoWatch } from '../../entities/video-watch.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(VideoWatch)
    private videoWatchRepository: Repository<VideoWatch>,
  ) {}

  // Báo cáo số lượng user theo thời gian
  async getUserStats(period: 'day' | 'week' | 'month', startDate?: string, endDate?: string) {
    const dateFilter = this.getDateFilter(period, startDate, endDate);
    
    const totalUsers = await this.userRepository.count();
    const newUsers = await this.userRepository.count({
      where: { createdAt: dateFilter.createdAt },
    });

    // Thống kê theo role
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateFilter.dateRange.startDate,
        endDate: dateFilter.dateRange.endDate,
      })
      .groupBy('user.role')
      .getRawMany();

    // Thống kê theo status
    const usersByStatus = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateFilter.dateRange.startDate,
        endDate: dateFilter.dateRange.endDate,
      })
      .groupBy('user.status')
      .getRawMany();

    return {
      period,
      dateRange: { startDate: dateFilter.dateRange.startDate, endDate: dateFilter.dateRange.endDate },
      totalUsers,
      newUsers,
      usersByRole,
      usersByStatus,
    };
  }

  // Báo cáo tiến độ học của user
  async getLearningProgress(userId: number, period: 'day' | 'week' | 'month', startDate?: string, endDate?: string) {
    // Kiểm tra user tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const dateFilter = this.getDateFilter(period, startDate, endDate);

    // Lấy danh sách khóa học user đã đăng ký
    const enrollments = await this.enrollmentRepository.find({
      where: { userId },
      relations: ['course'],
    });

    // Thống kê tổng quan
    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

    // Tính tổng số video trong các khóa học đã đăng ký
    let totalVideos = 0;
    let completedVideos = 0;
    let totalWatchTime = 0;

    for (const enrollment of enrollments) {
      const courseVideos = await this.videoRepository.find({
        where: { courseId: enrollment.courseId },
      });
      
      totalVideos += courseVideos.length;
      
      // Lấy thông tin watch time thực tế từ VideoWatch
      for (const video of courseVideos) {
        const videoWatch = await this.videoWatchRepository.findOne({
          where: { userId, videoId: video.id },
        });
        
        if (videoWatch) {
          totalWatchTime += videoWatch.watchTime;
          if (videoWatch.isCompleted) {
            completedVideos++;
          }
        }
      }
    }

    // Tính phần trăm hoàn thành
    const completionPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

    return {
      userId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      period,
      dateRange: { startDate: dateFilter.dateRange.startDate, endDate: dateFilter.dateRange.endDate },
      statistics: {
        totalEnrollments,
        activeEnrollments,
        totalVideos,
        completedVideos,
        totalWatchTime, // seconds
        completionPercentage: Math.round(completionPercentage * 100) / 100,
      },
      enrollments: enrollments.map(e => ({
        id: e.id,
        courseId: e.courseId,
        courseTitle: e.course?.title,
        status: e.status,
        startDate: e.start_at,
        endDate: e.end_at,
      })),
    };
  }

  // Báo cáo hoàn thành khóa học cụ thể
  async getCourseCompletion(userId: number, courseId: number) {
    // Kiểm tra user và course tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Kiểm tra enrollment
    const enrollment = await this.enrollmentRepository.findOne({
      where: { userId, courseId },
    });

    if (!enrollment) {
      throw new NotFoundException(`User ${userId} is not enrolled in course ${courseId}`);
    }

    // Lấy tất cả video của khóa học
    const courseVideos = await this.videoRepository.find({
      where: { courseId },
      order: { order: 'ASC' },
    });

    // Tính toán thống kê
    const totalVideos = courseVideos.length;
    const totalDuration = courseVideos.reduce((sum, video) => sum + video.duration, 0);
    
    // Lấy thông tin watch time thực tế
    let completedVideos = 0;
    let watchedDuration = 0;
    
    for (const video of courseVideos) {
      const videoWatch = await this.videoWatchRepository.findOne({
        where: { userId, videoId: video.id },
      });
      
      if (videoWatch) {
        watchedDuration += videoWatch.watchTime;
        if (videoWatch.isCompleted) {
          completedVideos++;
        }
      }
    }
    
    const completionPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;
    const watchPercentage = totalDuration > 0 ? (watchedDuration / totalDuration) * 100 : 0;

    return {
      userId,
      courseId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
      },
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        startDate: enrollment.start_at,
        endDate: enrollment.end_at,
        paymentStatus: enrollment.payment_status,
      },
      progress: {
        totalVideos,
        completedVideos,
        totalDuration, // seconds
        watchedDuration, // seconds
        completionPercentage: Math.round(completionPercentage * 100) / 100,
        watchPercentage: Math.round(watchPercentage * 100) / 100,
      },
      videos: await Promise.all(courseVideos.map(async (video) => {
        const videoWatch = await this.videoWatchRepository.findOne({
          where: { userId, videoId: video.id },
        });
        
        return {
          id: video.id,
          title: video.title,
          duration: video.duration,
          order: video.order,
          access: video.access,
          status: video.status,
          isCompleted: videoWatch?.isCompleted || false,
          watchTime: videoWatch?.watchTime || 0,
          completionPercentage: videoWatch?.completionPercentage || 0,
          lastWatchedAt: videoWatch?.lastWatchedAt,
        };
      })),
    };
  }

  // Báo cáo thời gian xem video
  async getVideoWatchTime(userId: number, period: 'day' | 'week' | 'month', startDate?: string, endDate?: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const dateFilter = this.getDateFilter(period, startDate, endDate);

    // Lấy enrollments của user
    const enrollments = await this.enrollmentRepository.find({
      where: { userId },
      relations: ['course'],
    });

    let totalWatchTime = 0;
    const courseStats = [];

    for (const enrollment of enrollments) {
      const courseVideos = await this.videoRepository.find({
        where: { courseId: enrollment.courseId },
      });

      const totalDuration = courseVideos.reduce((sum, video) => sum + video.duration, 0);
      let watchedDuration = 0;
      let completedVideos = 0;

      // Tính watch time thực tế từ VideoWatch
      for (const video of courseVideos) {
        const videoWatch = await this.videoWatchRepository.findOne({
          where: { userId, videoId: video.id },
        });
        
        if (videoWatch) {
          watchedDuration += videoWatch.watchTime;
          if (videoWatch.isCompleted) {
            completedVideos++;
          }
        }
      }

      totalWatchTime += watchedDuration;

      courseStats.push({
        courseId: enrollment.courseId,
        courseTitle: enrollment.course?.title,
        totalVideos: courseVideos.length,
        totalDuration,
        watchedDuration,
        completedVideos,
        completionPercentage: courseVideos.length > 0 ? (completedVideos / courseVideos.length) * 100 : 0,
      });
    }

    return {
      userId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      period,
      dateRange: { startDate: dateFilter.dateRange.startDate, endDate: dateFilter.dateRange.endDate },
      totalWatchTime, // seconds
      totalWatchTimeFormatted: this.formatDuration(totalWatchTime),
      courseStats,
    };
  }

  // Tổng quan báo cáo
  async getOverview(period: 'day' | 'week' | 'month', startDate?: string, endDate?: string) {
    const dateFilter = this.getDateFilter(period, startDate, endDate);

    // Thống kê user
    const totalUsers = await this.userRepository.count();
    const newUsers = await this.userRepository.count({ 
      where: { createdAt: dateFilter.createdAt } 
    });

    // Thống kê enrollment
    const totalEnrollments = await this.enrollmentRepository.count();
    const newEnrollments = await this.enrollmentRepository.count({ 
      where: { createdAt: dateFilter.createdAt } 
    });

    // Thống kê course
    const totalCourses = await this.courseRepository.count();
    const totalVideos = await this.videoRepository.count();

    // Thống kê enrollment theo status
    const enrollmentStats = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('enrollment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('enrollment.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateFilter.dateRange.startDate,
        endDate: dateFilter.dateRange.endDate,
      })
      .groupBy('enrollment.status')
      .getRawMany();

    return {
      period,
      dateRange: { startDate: dateFilter.dateRange.startDate, endDate: dateFilter.dateRange.endDate },
      users: {
        total: totalUsers,
        new: newUsers,
      },
      enrollments: {
        total: totalEnrollments,
        new: newEnrollments,
        byStatus: enrollmentStats,
      },
      content: {
        totalCourses,
        totalVideos,
      },
    };
  }

  // Track video watch time
  async trackVideoWatch(userId: number, videoId: number, watchTime: number, isCompleted?: boolean) {
    // Kiểm tra user và video tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }

    // Tìm hoặc tạo VideoWatch record
    let videoWatch = await this.videoWatchRepository.findOne({
      where: { userId, videoId },
    });

    if (!videoWatch) {
      videoWatch = this.videoWatchRepository.create({
        userId,
        videoId,
        watchTime: 0,
        duration: video.duration,
        completionPercentage: 0,
        isCompleted: false,
      });
    }

    // Cập nhật thông tin
    videoWatch.watchTime = watchTime;
    videoWatch.duration = video.duration;
    videoWatch.completionPercentage = video.duration > 0 ? (watchTime / video.duration) * 100 : 0;
    videoWatch.isCompleted = isCompleted || videoWatch.completionPercentage >= 90; // 90% được coi là hoàn thành
    videoWatch.lastWatchedAt = new Date();

    return await this.videoWatchRepository.save(videoWatch);
  }

  // Helper methods
  private getDateFilter(period: 'day' | 'week' | 'month', startDate?: string, endDate?: string) {
    const now = new Date();
    let dateFrom: Date;
    let dateTo: Date;

    if (startDate && endDate) {
      dateFrom = new Date(startDate);
      dateTo = new Date(endDate);
    } else {
      switch (period) {
        case 'day':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
          break;
        case 'week':
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          dateFrom = startOfWeek;
          dateTo = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
          break;
        case 'month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
          break;
      }
    }

    return {
      createdAt: Between(dateFrom, dateTo),
      dateRange: { startDate: dateFrom, endDate: dateTo },
    };
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}
