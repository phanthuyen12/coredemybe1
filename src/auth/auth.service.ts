import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../common/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
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

  async forgotPassword(email: string, resetUrl: string): Promise<{ message: string }> {
    const user = await this.UsersRepository.findOne({ where: { email } });
    
    // Không tiết lộ thông tin nếu email không tồn tại (bảo mật)
    if (!user) {
      // Vẫn trả về success để không tiết lộ email có tồn tại hay không
      return { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' };
    }

    // Tạo reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token hết hạn sau 1 giờ

    // Lưu token vào database
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await this.UsersRepository.save(user);

    // Tạo link reset password
    const resetLink = `${resetUrl}?token=${resetToken}`;

    // Gửi email
    await this.emailService.sendPasswordResetEmail(email, resetLink);

    return { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.UsersRepository.findOne({
      where: { resetToken: token },
    });

    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra token có hết hạn không
    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      // Xóa token đã hết hạn
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await this.UsersRepository.save(user);
      throw new BadRequestException('Token đã hết hạn. Vui lòng yêu cầu lại link đặt lại mật khẩu');
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.UsersRepository.save(user);

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
