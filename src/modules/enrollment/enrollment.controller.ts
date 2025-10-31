import { 
  Controller, Get, Post, Put, Delete, 
  Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Query 
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UseGuards, Req } from '@nestjs/common';
import { EnrollmentService } from "./enrollment.service";
import { BadRequestException } from '@nestjs/common';

import { EnrollmentDto } from "../../dto/enrollment.dto"; 
import { CreateEnrollmentDto } from "../../dto/create-enrollment.dto";
import { CheckEnrollmentDto } from "../../dto/check-enrollment.dto";
import { CancelEnrollmentDto } from "../../dto/cancel-enrollment.dto";
import { Enrollment } from "../../entities/enrollment.entity";   
import { ResponseData } from "../../common/response-data";
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}
    @Get('check')
async checkAccess(
  @Query('user_id') user_id: string,
  @Query('course_id') course_id: string
): Promise<ResponseData<any>> {

  const uid = Number(user_id);
  const cid = Number(course_id);

  if (isNaN(uid) || isNaN(cid)) {
    throw new BadRequestException("user_id và course_id phải là số");
  }

  const dto: CheckEnrollmentDto = { user_id: uid, course_id: cid };
  const result = await this.enrollmentService.checkAccess(dto);

  return new ResponseData(result, 200, result.message);
}
    @Get()
    async getAll(
        @Query('user_id') userIdStr?: string,
        @Query('course_id') courseIdStr?: string,
        @Query('page') pageStr?: string,
        @Query('limit') limitStr?: string,
    ): Promise<ResponseData<any>> {
        const userId = userIdStr !== undefined ? Number(userIdStr) : undefined;
        const courseId = courseIdStr !== undefined ? Number(courseIdStr) : undefined;
        const page = pageStr !== undefined ? Number(pageStr) : 1;
        const limit = limitStr !== undefined ? Number(limitStr) : 10;

        if ((userIdStr !== undefined && Number.isNaN(userId)) || (courseIdStr !== undefined && Number.isNaN(courseId))) {
            return new ResponseData([], 400, 'Invalid query params');
        }
        if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
            return new ResponseData([], 400, 'Invalid pagination params');
        }

        const res = await this.enrollmentService.findWithFiltersPaginated(page, limit, userId, courseId);
        return new ResponseData(res, 200, 'Get enrollments success');
    }
    @Get('/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<Enrollment>> {
        const enrollment = await this.enrollmentService.findOne(id);
        return new ResponseData(enrollment, 200, 'Get enrollment by id success');

    }
    // 1. Create Enrollment (Tạo enrollment mới)
    @Post()
    async createEnrollment(@Body() dto: CreateEnrollmentDto): Promise<ResponseData<any>> {
        const result = await this.enrollmentService.createEnrollment(dto);
        return new ResponseData(result, 200, result.message);
    }

    // 1b. Simple Create Enrollment (Tạo enrollment đơn giản - chỉ cần user_id và course_id)
    @Post('simple')
    async createSimpleEnrollment(
        @Body() body: { user_id: number; course_id: number }
    ): Promise<ResponseData<any>> {
        const dto: CreateEnrollmentDto = {
            user_id: body.user_id,
            course_id: body.course_id
        };
        const result = await this.enrollmentService.createEnrollment(dto);
        return new ResponseData(result, 200, result.message);
    }
    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, 
        @Body() enrollmentDto: EnrollmentDto
    ): Promise<ResponseData<Enrollment>> {
        const updatedEnrollment = await this.enrollmentService.update(id, enrollmentDto);
        return new ResponseData(updatedEnrollment, 200, 'Enrollment updated successfully'); 
    }   
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<null>> {
        await this.enrollmentService.remove(id);
        return new ResponseData(null, 200, 'Enrollment deleted successfully');
    }

    // New endpoints for the requested APIs

    // 2. Check Enrollment (Kiểm tra quyền truy cập)



    // 2b. Check Enrollment (có token) -> trả về boolean
    @UseGuards(AuthGuard('jwt'))
    @Get('check/secure')
    async checkAccessSecure(
        @Req() req: Request,
        @Query('user_id', ParseIntPipe) user_id: number,
        @Query('course_id', ParseIntPipe) course_id: number,
    ): Promise<ResponseData<{ hasEnrollment: boolean }>> {
        const authUser: any = (req as any).user;
        const authId = Number(authUser?.id ?? authUser?.sub);
        if (!authId || authId !== user_id) {
            return new ResponseData({ hasEnrollment: false }, 403, 'Forbidden: token does not match user id');
        }
        const dto: CheckEnrollmentDto = { user_id, course_id };
        const result = await this.enrollmentService.checkAccess(dto);
        return new ResponseData({ hasEnrollment: result.canAccess }, 200, result.message);
    }

    // 3. Cancel Enrollment (Huỷ quyền — Refund / Banned)
    @Put(':id/cancel')
    async cancelEnrollment(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CancelEnrollmentDto
    ): Promise<ResponseData<any>> {
        const result = await this.enrollmentService.cancelEnrollment(id, dto);
        return new ResponseData(result, 200, result.message);
    }

    // 4. Delete Enrollment (Xoá hoàn toàn) - already exists above
}
