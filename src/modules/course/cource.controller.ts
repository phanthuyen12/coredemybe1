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
        @Query('active') active?: string,
    ): Promise<ResponseData<any>> {
        // Parse page và limit
        const pageNum = page && !isNaN(Number(page)) ? Number(page) : 1;
        const limitNum = limit && !isNaN(Number(limit)) ? Number(limit) : 10;

        // Xử lý title: chỉ filter nếu có giá trị và không rỗng
        const titleFilter = title && title.trim() !== '' ? title.trim() : undefined;

        // Xử lý active: 
        // - Nếu active rỗng/undefined/null → undefined (KHÔNG filter, lấy cả true và false)
        // - Nếu active = "true" hoặc "1" → true (chỉ lấy active = 1)
        // - Nếu active = "false" hoặc "0" → false (chỉ lấy active = 0)
        let activeFilter: boolean | undefined = undefined;
        if (active !== undefined && active !== null && active !== '') {
            const activeStr = active.toString().toLowerCase().trim();
            if (activeStr === 'true' || activeStr === '1') {
                activeFilter = true;
            } else if (activeStr === 'false' || activeStr === '0') {
                activeFilter = false;
            }
            // Nếu không phải true/false/1/0 → giữ undefined (KHÔNG filter, lấy TẤT CẢ)
        }
        // Nếu active rỗng hoặc không có → activeFilter = undefined → lấy TẤT CẢ courses

        const res = await this.courceService.findWithFilter(pageNum, limitNum, titleFilter, activeFilter);
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

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<null>> {
    await this.courceService.delete(id);
    return new ResponseData(null, 200, 'Course deleted successfully');
  }

}