import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

declare const module: any;

async function bootstrap() {
  // Tắt body parser mặc định của NestJS để tránh conflict với Multer
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Lấy Express instance và cấu hình body parser với giới hạn lớn
  const expressApp = app.getHttpAdapter().getInstance();
  
  // Cấu hình body parser cho JSON và URL-encoded (không ảnh hưởng đến multipart/form-data)
  // Tăng lên 500MB để hỗ trợ upload video lớn
  expressApp.use(require('express').json({ limit: '500mb' }));
  expressApp.use(require('express').urlencoded({ 
    limit: '500mb', 
    extended: true, 
    parameterLimit: 50000 
  }));
  
  // Multer sẽ tự xử lý multipart/form-data với limit đã cấu hình trong multer.config.ts
  // Multer không bị ảnh hưởng bởi body parser ở trên

  app.enableCors({
    origin: 'https://3hstation.com', // bỏ dấu /
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',  
    allowedHeaders: 'Content-Type, Accept, Authorization',
    maxAge: 3600, // Cache preflight requests
  });

  const config = new DocumentBuilder()
    .setTitle('Core Khoa Hoc API')
    .setDescription('API cho khoá học, danh mục, video')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Tăng timeout cho upload file lớn (10 phút = 600000ms)
  const server = await app.listen(process.env.PORT ?? 3000);
  server.timeout = 600000; // 10 phút timeout
  server.keepAliveTimeout = 65000; // 65 giây keep-alive

  // Nếu dùng HMR
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
