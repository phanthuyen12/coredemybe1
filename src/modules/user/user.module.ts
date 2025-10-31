import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../../entities/course.entity";
import { Video } from "../../entities/video.entity";
import { User } from "../../entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";   
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers: [UserController],

})
export class UserModule {}