import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "../../entities/ticket.entity";
import { TicketMessage } from "../../entities/ticket-message.entity";
import { User } from "../../entities/user.entity";
import { TicketsService } from "./tickets.service";
import { TicketController } from "./tickets.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketMessage, User]), // thêm TicketMessage + User
  ],
  providers: [TicketsService],
  controllers: [TicketController],
})
export class TicketModule {}
