import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { InvitationService } from 'src/invitation/invitation.service';
import { MailModule } from 'src/mail/mail.module';
import { InvitationModule } from 'src/invitation/invitation.module';
import { UsersController } from './users.controller';

@Module({
  imports: [InvitationModule, MailModule],
  providers: [UsersService, PrismaService, InvitationService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
