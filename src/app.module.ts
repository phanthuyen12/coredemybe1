import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/products/product.module';
import { CourcetModule } from './modules/course/cource.module';
import { Product } from './entities/products.entity';
import { Course } from './entities/course.entity';
import { Video } from './entities/video.entity';
import { Enrollment } from './entities/enrollment.entity';
import { User } from './entities/user.entity';
import { VideoModule } from './modules/video/video.module';
import { EnrollmentsModule } from './modules/enrollment/enrollment.module';
import { UserModule } from './modules/user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Category } from './entities/category.entity';
import { CategoryModule } from './modules/category/category.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import {Ticket} from './entities/ticket.entity'
import {TicketMessage} from './entities/ticket-message.entity'
import {VideoWatch} from './entities/video-watch.entity'
import {AuthModule} from './auth/auth.module';
import {TicketModule} from './modules/tickets/tickets.module'
import {ReportsModule} from './modules/reports/reports.module'
// import { WebsiteMeta } from './entities/website-meta.entity'
// import { SiteModule } from './modules/site/site.module'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'corekhoahoc',
      entities: [Product, Course, Video, Enrollment, User, Category,Ticket,TicketMessage,VideoWatch],
      synchronize: true,
    }),
    ProductModule,
    CourcetModule,
    VideoModule,
    EnrollmentsModule,
    UserModule,
    CategoryModule,
    AuthModule, // 👈 chỉ giữ cái này
    TicketModule,
    ReportsModule,
    // SiteModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api*'],
    }),
  ],
})
export class AppModule {}

