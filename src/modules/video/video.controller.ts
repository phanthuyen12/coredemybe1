import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

import { VideoService } from './video.service';
import { VideoDto } from '../../dto/video.dto';
import { Video } from '../../entities/video.entity';
import { ResponseData } from '../../common/response-data';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { multerConfig } from '../../common/multer.config';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}
 @Get('filter')
async findWithFilter(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title?: string,
    @Query('categoryId') categoryId?: number,
    @Query('courseId') courseId?: number,
    @Query('status') status?: string,
    // XÓA DÒNG NÀY: @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
): Promise<ResponseData<any>> {
    const res = await this.videoService.findWithFilter(
        page,
        limit,
        title,
        categoryId,
        courseId,
        status,
        // XÓA `sort` KHỎI ĐÂY
    );
    return new ResponseData(res, 200, 'Get filtered videos success');
}
  @Get()
  async getAll(): Promise<ResponseData<Video[]>> {
    const videos = await this.videoService.getAll();
    return new ResponseData(videos, 200, 'Get all videos success');
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<Video>> {
    const video = await this.videoService.getById(id);
    return new ResponseData(video, 200, 'Get video by id success');
  }
 
@Post()
@UseInterceptors(FileInterceptor('video', multerConfig('videos')))
  async create(
    @Body() videoDto: VideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseData<any>> {
    // Nếu có upload file thì gán tên file
    if (file) {
      videoDto.url = file.filename;
    }

    // ✅ Nếu muốn check thiếu field thủ công
    const requiredFields = ['title', 'courseId', 'categoryId'];
    const missing = requiredFields.filter((field) => !videoDto[field]);
    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missing.join(', ')}`,
      );
    }

    // Tạo video mới
    const newVideo = await this.videoService.create(videoDto);
    return new ResponseData(newVideo, 200, 'Video created successfully');
  }


  @Post('update/:id') // 👈 Đổi thành PUT và đường dẫn gọn hơn
  @UseInterceptors(FileInterceptor('url', multerConfig('videos'))) // 👈 THÊM DÒNG QUAN TRỌNG NÀY
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() videoDto: VideoDto,
    @UploadedFile() file: Express.Multer.File, // Bây giờ file sẽ được nhận
  ): Promise<ResponseData<Video>> {
    if (file) {
      videoDto.url = file.filename; // Gán tên file mới vào DTO
    }

    const updatedVideo = await this.videoService.update(id, videoDto);
    return new ResponseData(updatedVideo, 200, 'Video updated successfully');
  }

  @Delete('/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<null>> {
    await this.videoService.delete(id);
    return new ResponseData(null, 200, 'Video deleted successfully');
  }
  @Get('/by-course/:courseId')
  async getByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ): Promise<ResponseData<Video[]>> {
    const data = await this.videoService.getByCourseId(courseId);
    return new ResponseData(data, 200, 'Get videos by course success');
  }
 
}
