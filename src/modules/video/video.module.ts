import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Video } from "../../entities/video.entity";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";   
import { Course } from "../../entities/course.entity";
import { Category } from '../../entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course,Video,Category])],
    providers: [VideoService],
    controllers: [VideoController],

})
export class VideoModule {}