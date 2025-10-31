import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthGuard} from '@nestjs/passport'
import { get } from 'http';
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
}
