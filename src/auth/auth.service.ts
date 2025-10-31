import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(email: string, username: string, password: string) {
    const existingUser = await this.UsersRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictException('Email hoặc Username đã được đăng ký');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.UsersRepository.create({
      email,
      username,
      password: hashPassword,
    });

    await this.UsersRepository.save(user);
    return { message: 'Đăng ký thành công', userId: user.id };
  }

  async loginUser(email: string, password: string) {
    const user = await this.UsersRepository.findOne({ where: { email } });
    if (!user)
      throw new UnauthorizedException('Sai email hoặc chưa được đăng ký');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const payload = { sub: user.id, username: user.username, role: user.role };
    console.log('JWT Payload:', payload);
    const token = this.jwtService.sign(payload);
    console.log('Generated JWT Token:', token);
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: number) {
    return await this.UsersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'username', 'role'],
    });
  }
}
