import { Controller, Get, Post, Param, Body, ParseIntPipe ,BadRequestException,  UseInterceptors,  UploadedFile,

} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from 'src/dto/create-ticket.dto';
import { ReplyTicketDto } from 'src/dto/reply-ticket.dto';
import { multerConfig } from '../../common/multer.config';
import { Express } from 'express';
import { ResponseData } from '../../common/response-data';

import { FileInterceptor } from '@nestjs/platform-express';
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketsService) {}

  // GET /tickets - Lấy tất cả ticket
  @Get()
  async getAll() {
    return this.ticketsService.findAll();
  }

  // GET /tickets/:id - Lấy ticket theo ID kèm messages
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  // POST /tickets - Tạo ticket mới
@Post()
@UseInterceptors(FileInterceptor('image', multerConfig('tickets')))

async createTicket(
  @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseData<any>> {
    // Nếu có upload file thì gán tên file
    if (file) {
  dto.image = file.filename;
}

  console.log(dto)
  console.log(dto.userId)
  const uid = Number(dto.userId);
  if (isNaN(uid)) {
    throw new BadRequestException('userId must be a number');
  }
  const res = await  this.ticketsService.createTicket(dto, uid);
      return new ResponseData(res, 200, 'Video created successfully');

}

// {
//   "title": "Tôi gặp lỗi thanh toán",
//   "message": "Hệ thống báo lỗi 500",
//   "image": null,
//   "userId": 2
// }


  // POST /tickets/:id/reply - Reply ticket
  @Post(':id/reply')
  @UseInterceptors(FileInterceptor('image', multerConfig('tickets')))
  async replyTicket(
    @Param('id', ParseIntPipe) ticketId: number,
    @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseData<any>> {
    // Nếu có upload file thì gán tên file
    if (file) {
      dto.image = file.filename;
    }

    const userId = Number(dto.userId);
    if (isNaN(userId)) {
      throw new BadRequestException('userId must be a number');
    }

    const res = await this.ticketsService.replyTicket(ticketId, dto, userId);
    return new ResponseData(res, 200, 'Reply sent successfully');
  }

  // GET /tickets/user/:userId - Lấy tất cả tickets theo user
  @Get('user/:userId')
  async getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ticketsService.findByUser(userId);
  }
}
