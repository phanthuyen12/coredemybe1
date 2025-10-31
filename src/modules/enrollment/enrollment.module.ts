import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../../entities/course.entity";
import { Video } from "../../entities/video.entity";
import { Enrollment } from "../../entities/enrollment.entity";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";   
@Module({
    imports: [TypeOrmModule.forFeature([Enrollment])],
    providers: [EnrollmentService],
    controllers: [EnrollmentController],

})
export class EnrollmentsModule {}