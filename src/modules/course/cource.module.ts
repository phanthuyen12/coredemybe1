import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../../entities/course.entity";
import { Video } from "../../entities/video.entity";
import { Category } from "../../entities/category.entity";
import { Enrollment } from "../../entities/enrollment.entity";
import { CourceService } from "./cource.service";
import { CourceController } from "./cource.controller";   
@Module({
    imports: [TypeOrmModule.forFeature([Course,Video,Category,Enrollment])],
    providers: [CourceService],
    controllers: [CourceController],

})
export class CourcetModule {}