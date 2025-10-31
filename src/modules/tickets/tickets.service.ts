import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketMessage } from 'src/entities/ticket-message.entity';
import { CreateTicketDto } from 'src/dto/create-ticket.dto';
import { ReplyTicketDto } from 'src/dto/reply-ticket.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketMessage) private messageRepo: Repository<TicketMessage>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Tạo ticket mới + message đầu tiên
  async createTicket(dto: CreateTicketDto, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

   const ticket = this.ticketRepo.create({
  title: dto.title,
  issueType: dto.issueType,   // thêm dòng này
  user,
  userId: user.id,
});

    const savedTicket = await this.ticketRepo.save(ticket);

    // Nếu có message đầu tiên thì tạo luôn
    if (dto.message || dto.image) {
      const message = this.messageRepo.create({
        message: dto.message,
        image: dto.image,
        sender: user,
        senderId: user.id,
        ticket: savedTicket,
        ticketId: savedTicket.id,
      });
      await this.messageRepo.save(message);
    }

    return this.ticketRepo.findOne({
      where: { id: savedTicket.id },
      relations: ['messages', 'messages.sender', 'user'],
      order: { messages: { createdAt: 'ASC' } },
    });
  }

  // Reply ticket
  async replyTicket(ticketId: number, dto: ReplyTicketDto, userId: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Kiểm tra có ít nhất message hoặc image
    if (!dto.message && !dto.image) {
      throw new BadRequestException('Message or image is required');
    }

    const reply = this.messageRepo.create({
      message: dto.message,
      image: dto.image,
      sender: user,
      senderId: user.id,
      ticket,
      ticketId: ticket.id,
    });

    return this.messageRepo.save(reply);
  }

  // Lấy ticket theo id kèm messages + sender
  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['messages', 'messages.sender', 'user'],
      order: { messages: { createdAt: 'ASC' } },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  // Lấy tất cả ticket (chỉ user info, không cần message)
  async findAll() {
    return this.ticketRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy tất cả tickets theo user
  async findByUser(userId: number) {
    return this.ticketRepo.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
