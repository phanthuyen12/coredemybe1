import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
import { Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../../entities/user.entity";
import { UserDto } from "../../dto/user.dto"; 
import { faker } from '@faker-js/faker';
import * as crypto from "crypto";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../dto/update-user.dto';

// import { JwtService } from "@nestjs/jwt";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createRandomUser(): Promise<User> {
    const user = this.userRepository.create({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      role: faker.helpers.arrayElement(['ctv', 'admin']),
    });
    return await this.userRepository.save(user);
  }

  // Tạo nhiều user ngẫu nhiên
  async createRandomUsers(count: number = 1000): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      const u = await this.createRandomUser();
      users.push(u);
    }
    return users;
  }
  // Tạo user mới với kiểm tra trùng username/email
  async create(userDto: UserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { username: userDto.username } });
    if (existingUser) throw new BadRequestException(`Username "${userDto.username}" already exists`);

    const existingEmail = await this.userRepository.findOne({ where: { email: userDto.email } });
    if (existingEmail) throw new BadRequestException(`Email "${userDto.email}" already exists`);

    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  // Lấy tất cả user
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Lấy user theo id
  async findOne(id: number): Promise<User> {    
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Cập nhật user
  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (userDto.username && userDto.username !== user.username) {
      const existUsername = await this.userRepository.findOne({ where: { username: userDto.username } });
      if (existUsername && existUsername.id !== id) {
        throw new BadRequestException(`Username "${userDto.username}" already exists`);
      }
      user.username = userDto.username;
    }

    if (userDto.email && userDto.email !== user.email) {
      const existEmail = await this.userRepository.findOne({ where: { email: userDto.email } });
      if (existEmail && existEmail.id !== id) {
        throw new BadRequestException(`Email "${userDto.email}" already exists`);
      }
      user.email = userDto.email;
    }

    if (typeof userDto.role === 'string' && userDto.role.length > 0) {
      user.role = userDto.role;
    }

    if (userDto.password && userDto.password.length > 0) {
      const hashed = await bcrypt.hash(userDto.password, 10);
      user.password = hashed;
    }

    return await this.userRepository.save(user);
  }

  // Xóa user
  async remove(id: number): Promise<void> {   
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  async InactiveUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.status = user.status === 'inactive' ? 'active' : 'inactive';
    return await this.userRepository.save(user);
  }
  // async loginUser(user:any){
  //   const users = await this.findOne({});

  // }
  // ===== API filter & pagination =====
  async findWithFilter(
    page = 1,
    limit = 10,
    role?: string,
    email?: string,
    phone?: string,
    status?: string,
    sort: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {

    let query: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder('user');

    // Filter
    if (role) query = query.andWhere('user.role = :role', { role });
    if (email) query = query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    if (phone) query = query.andWhere('user.phone LIKE :phone', { phone: `%${phone}%` });
    if (status) query = query.andWhere('user.status = :status', { status });

    // Tổng số bản ghi
    const total = await query.getCount();

    // Phân trang
    const data = await query
      .orderBy('user.createdAt', sort)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }


async changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }

  // Kiểm tra mật khẩu cũ
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  console.log('isMatch:', isMatch);
  if (!isMatch) {
    throw new BadRequestException('Old password is incorrect');
  }

  // Mã hoá mật khẩu mới
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  await this.userRepository.save(user);
}
  
  async updateProfileById(id: number, username: string, email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Check duplicate username (excluding current user)
    if (username && username !== user.username) {
      const existingUsername = await this.userRepository.findOne({ where: { username } });
      if (existingUsername && existingUsername.id !== id) {
        throw new BadRequestException(`Username "${username}" already exists`);
      }
      user.username = username;
    }

    // Check duplicate email (excluding current user)
    if (email && email !== user.email) {
      const existingEmail = await this.userRepository.findOne({ where: { email } });
      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException(`Email "${email}" already exists`);
      }
      user.email = email;
    }

    return await this.userRepository.save(user);
  }
}
