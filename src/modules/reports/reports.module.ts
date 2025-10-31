import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { User } from '../../entities/user.entity';
import { Enrollment } from '../../entities/enrollment.entity';
import { Video } from '../../entities/video.entity';
import { Course } from '../../entities/course.entity';
import { VideoWatch } from '../../entities/video-watch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Enrollment, Video, Course, VideoWatch]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
