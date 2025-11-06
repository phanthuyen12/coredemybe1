import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthGuard} from '@nestjs/passport'
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResponseData } from '../common/response-data';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @Post('register')
async register(@Body() body: any) {
    console.log(body)
  return this.authService.registerUser(body.email, body.username, body.password);
}

  // POST /auth/login
  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    console.log(email)
    console.log(password)
    return this.authService.loginUser(email, password);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('me')
  async getProfile(@Request() req) {
   const authUser = req.user;
   console.log('Auth /me req.user =', authUser);
   const userId = Number(authUser?.id ?? authUser?.sub);
   return this.authService.getMe(userId);

  }

  // POST /auth/forgot-password
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ResponseData<any>> {
    // Nếu không có resetUrl trong body, sử dụng giá trị từ env hoặc mặc định
    const resetUrl = dto.resetUrl || process.env.FRONTEND_RESET_PASSWORD_URL || 'http://localhost:3000/reset-password';
    const result = await this.authService.forgotPassword(dto.email, resetUrl);
    return new ResponseData(result, 200, result.message);
  }

  // POST /auth/reset-password
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<ResponseData<any>> {
    const result = await this.authService.resetPassword(dto.token, dto.newPassword);
    return new ResponseData(result, 200, result.message);
  }
}
