import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import {JwtStrategy} from './jwt.strategy';
import { EmailService } from '../common/email.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'c88fbd6afd1c6e7ace6305c48deb2ba2848ea2601f8e66da00ba72d9022087e9d759d0929ab6ee38527e6901a4ba19594254ff4b5afb05134edf2cd5057dfb46',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, EmailService],
  controllers: [AuthController],
  exports: [AuthService], // 👈 nếu module khác cần dùng
})
export class AuthModule {}
