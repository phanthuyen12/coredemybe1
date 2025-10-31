import { 
  Controller, Get, Post, Put, Delete, 
  Param, Body, ParseIntPipe, UsePipes, ValidationPipe ,UploadedFile,Query,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CourceService } from "./cource.service";
import { CourseDto } from "../../dto/cource.dto"; 
import { Course } from "../../entities/course.entity";   
import { ResponseData } from "../../common/response-data";
import {multerConfig} from '../../common/multer.config';
import { Express } from 'express';
import { get } from "http";
@Controller('courses')
export class CourceController {
    constructor(private readonly courceService: CourceService) {}
      @Get('head-office')
  async getHeadOffice(): Promise<ResponseData<Course | null>> {
    console.log('Fetching head office course');
      const course = await this.courceService.getHeadOfficeCourse();
      return new ResponseData(course, 200, 'Get head office course success');
  }
    @Get('filter')
    async findWithFilter(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('title') title?: string,
        @Query('active') active?: boolean,
    ): Promise<ResponseData<any>> {
        const res = await this.courceService.findWithFilter(page, limit, title, active);
        return new ResponseData(res, 200, 'Get filtered cources success');
    }
    @Get()
    async getAll(): Promise<ResponseData<Course[]>> {
        const cources = await this.courceService.getAll();
        return new ResponseData(cources, 200, 'Get all cources success');
    }
    @Get('/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<Course>> {
        const cource = await this.courceService.getById(id);
        return new ResponseData(cource, 200, 'Get cource by id success');   

    }
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail', multerConfig('courses')))
  async create(
  @Body() courceDto: CourseDto,
  @UploadedFile() file: Express.Multer.File
): Promise<ResponseData<Course>> {
  if (file) {
    courceDto.thumbnail = file.filename; // gắn tên file vào DTO
  }
  const newCource = await this.courceService.create(courceDto);
  return new ResponseData(newCource, 201, 'Cource created successfully');
}

    @Post('/update/:id')
    @UseInterceptors(FileInterceptor('thumbnail', multerConfig('courses')))

    async update(@Param('id', ParseIntPipe) id: number, 
        @Body() courceDto: CourseDto,
          @UploadedFile() file: Express.Multer.File

    ): Promise<ResponseData<Course>> {
        if (file) {
    courceDto.thumbnail = file.filename; // gắn tên file vào DTO
  }
        const updatedCource = await this.courceService.update(id, courceDto);
        return new ResponseData(updatedCource, 200, 'Cource updated successfully'); 
    }   
      @Post("fake-many")
  async fakeMany(@Query("count") count: number = 10) {
    return this.courceService.createFakeMany(Number(count));
  }
  @Get("/detail-course/:id")
  async getDetailCourse(@Param("id") id : number=0){
    const res = await this.courceService.getByIdWithCategoriesAndVideos(id)
        return new ResponseData(res, 200, 'Cource updated successfully'); 

  }

}