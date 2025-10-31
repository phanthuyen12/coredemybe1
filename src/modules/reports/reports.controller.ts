import { Controller, Get, Post, Query, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ResponseData } from '../../common/response-data';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // GET /reports/users - Báo cáo số lượng user theo thời gian
  @Get('users')
  async getUserStats(
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ResponseData<any>> {
    const stats = await this.reportsService.getUserStats(period, startDate, endDate);
    return new ResponseData(stats, 200, 'User statistics retrieved successfully');
  }

  // GET /reports/learning-progress/:userId - Báo cáo tiến độ học của user
  @Get('learning-progress/:userId')
  async getLearningProgress(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ResponseData<any>> {
    const progress = await this.reportsService.getLearningProgress(userId, period, startDate, endDate);
    return new ResponseData(progress, 200, 'Learning progress retrieved successfully');
  }

  // GET /reports/course-completion/:userId/:courseId - Báo cáo hoàn thành khóa học
  @Get('course-completion/:userId/:courseId')
  async getCourseCompletion(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<ResponseData<any>> {
    const completion = await this.reportsService.getCourseCompletion(userId, courseId);
    return new ResponseData(completion, 200, 'Course completion data retrieved successfully');
  }

  // GET /reports/video-watch-time/:userId - Báo cáo thời gian xem video
  @Get('video-watch-time/:userId')
  async getVideoWatchTime(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ResponseData<any>> {
    const watchTime = await this.reportsService.getVideoWatchTime(userId, period, startDate, endDate);
    return new ResponseData(watchTime, 200, 'Video watch time retrieved successfully');
  }

  // GET /reports/overview - Tổng quan báo cáo
  @Get('overview')
  async getOverview(
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ResponseData<any>> {
    const overview = await this.reportsService.getOverview(period, startDate, endDate);
    return new ResponseData(overview, 200, 'Overview report retrieved successfully');
  }

  // POST /reports/track-video-watch - Track video watch time
  @Post('track-video-watch')
  async trackVideoWatch(
    @Body() body: { userId: number; videoId: number; watchTime: number; isCompleted?: boolean },
  ): Promise<ResponseData<any>> {
    const result = await this.reportsService.trackVideoWatch(
      body.userId,
      body.videoId,
      body.watchTime,
      body.isCompleted,
    );
    return new ResponseData(result, 200, 'Video watch time tracked successfully');
  }
}
