import { Controller, Get, Post, Put, Delete, Query, Param, Body, ParseIntPipe, UseGuards, Req } from "@nestjs/common";
import { UserDto } from "../../dto/user.dto";
import { User } from "../../entities/user.entity";
import { UserService } from "./user.service";
import { ResponseData } from "../../common/response-data";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('role') role?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('status') status?: string,
        @Query('sort') sort: 'ASC' | 'DESC' = 'DESC'
    ): Promise<ResponseData<any>> {

        const res = await this.userService.findWithFilter(page, limit, role, email, phone, status, sort);
        return new ResponseData(res, 200, 'Get filtered users success');
    }
@Post('change-password')
async changePassword(
  @Body() dto: ChangePasswordDto
): Promise<ResponseData<string>> {
  const email = dto.email;
  console .log('Changing password for email:', email);
  console.log('Old Password:', dto.oldPassword);
    console.log('New Password:', dto.newPassword);
  await this.userService.changePassword(email, dto.oldPassword, dto.newPassword);
  return new ResponseData(null, 200, 'Password changed successfully');
}
    @Get('/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<User>> {
        const res = await this.userService.findOne(id);
        return new ResponseData(res, 200, 'Get user by ID success');
    }

    @Post()
    async create(@Body() userDto: UserDto): Promise<ResponseData<User>> { 
        const newUser = await this.userService.create(userDto); 
        return new ResponseData(newUser, 200, 'Create user success');
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() userDto: UpdateUserDto): Promise<ResponseData<User>> {
        const updated = await this.userService.update(id, userDto);
        return new ResponseData(updated, 200, 'Update user success');
    }

    @Put(':id/profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(
      @Param('id', ParseIntPipe) id: number,
      @Req() req,
      @Body() dto: UpdateProfileDto
    ): Promise<ResponseData<User>> {
      const authUser = req.user;
      const authId = Number(authUser?.id ?? authUser?.sub);
      if (!authId || authId !== id) {
        return new ResponseData(null, 403, 'Forbidden: token does not match user id');
      }
      const updated = await this.userService.updateProfileById(id, dto.username, dto.email);
      return new ResponseData(updated, 200, 'Update profile success');
    }

    @Delete('/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<null>> {
        await this.userService.remove(id);
        return new ResponseData(null, 200, 'Delete user success');
    }
      @Post('random')
  async createRandom(@Query('count') count: number = 1000) {
    const users = await this.userService.createRandomUsers(count);
    return new ResponseData(users, 200, `${users.length} users created successfully`);
  }
    @Post('inactive/:id')
    async inactiveUser(@Param('id', ParseIntPipe) id: number): Promise<ResponseData<User>> {
        console.log('Inactive user with ID:', id);
        const users = await this.userService.InactiveUser(id);
        return new ResponseData(users, 200, `User with ID ${id} set to inactive successfully`);
    }
}
